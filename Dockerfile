FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json .
RUN npm ci

COPY client/package.json client/package-lock.json ./client/
RUN npm ci --prefix client

COPY server/package.json server/package-lock.json ./server/
RUN npm ci --prefix server

COPY . .

ARG SERVER_PORT=5000
ARG VERSION
ARG NEXT_PUBLIC_COGNITO_POOL_ENDPOINT=http://localhost:$SERVER_PORT
ARG NEXT_PUBLIC_COGNITO_POOL_ID=ap-northeast-1_randomPoolId
ARG NEXT_PUBLIC_COGNITO_CLIENT_ID=random-client-id
ARG DATABASE_URL=file:../../data/app.db

RUN npm run batch:writeVersion -- $VERSION
RUN npm run build

FROM node:20-alpine

WORKDIR /usr/src/app

ARG CLIENT_PORT=5001

ENV PORT=5000
ENV CLIENT_PORT=$CLIENT_PORT
ENV CORS_ORIGIN=http://localhost:$CLIENT_PORT
ENV DATABASE_URL=file:../../data/app.db
ENV SMTP_HOST=inbucket
ENV SMTP_PORT=2500
ENV SMTP_USER=fake_mail_user
ENV SMTP_PASS=fake_mail_password

COPY package.json .
COPY --from=builder /usr/src/app/client/out ./client/out

COPY server/package.json server/package-lock.json ./server/
RUN npm ci --omit=dev --prefix server

COPY --from=builder /usr/src/app/server/index.js ./server/index.js
COPY --from=builder /usr/src/app/server/node_modules/.prisma ./server/node_modules/.prisma
COPY --from=builder /usr/src/app/server/prisma ./server/prisma
RUN apk --no-cache add curl
COPY --from=builder /usr/src/app/data ./data

HEALTHCHECK --interval=5s --timeout=5s --retries=3 CMD curl -f http://localhost:$PORT/health && curl -f $CORS_ORIGIN || exit 1

EXPOSE ${PORT} ${CLIENT_PORT}
VOLUME ["/usr/src/app/data"]

CMD ["npm", "start"]
