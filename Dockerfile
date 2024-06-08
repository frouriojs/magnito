FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json .
RUN npm ci

COPY client/package.json client/package-lock.json ./client/
RUN npm ci --prefix client

COPY server/package.json server/package-lock.json ./server/
RUN npm ci --prefix server

COPY . .

ARG VERSION
ENV NEXT_PUBLIC_COGNITO_POOL_ENDPOINT=http://localhost:5000
ENV NEXT_PUBLIC_COGNITO_POOL_ID=ap-northeast-1_randomPoolId
ENV NEXT_PUBLIC_COGNITO_CLIENT_ID=random-client-id
ENV DATABASE_URL=file:../../data/app.db

RUN npm run batch:writeVersion -- $VERSION
RUN npm run build

FROM node:20-alpine

WORKDIR /usr/src/app

ENV NEXT_PUBLIC_COGNITO_POOL_ENDPOINT=http://localhost:5000
ENV NEXT_PUBLIC_COGNITO_POOL_ID=ap-northeast-1_randomPoolId
ENV NEXT_PUBLIC_COGNITO_CLIENT_ID=random-client-id
ENV PORT=5000
ENV API_ORIGIN=http://localhost:5000
ENV CORS_ORIGIN=http://localhost:5001
ENV DATABASE_URL=file:../../data/app.db
ENV SMTP_HOST=inbucket
ENV SMTP_PORT=2500
ENV SMTP_USER=fake_mail_user
ENV SMTP_PASS=fake_mail_password

COPY --from=builder /usr/src/app/client/.next ./client/.next
COPY client/package.json client/package-lock.json ./client/
RUN npm ci --omit=dev --prefix client

COPY server/package.json server/package-lock.json ./server/
RUN npm ci --omit=dev --prefix server

COPY --from=builder /usr/src/app/server/index.js ./server/index.js
COPY --from=builder /usr/src/app/server/node_modules/.prisma ./server/node_modules/.prisma
COPY --from=builder /usr/src/app/server/prisma ./server/prisma
COPY package.json .
RUN npm install -g npm-run-all
RUN apk --no-cache add curl
COPY --from=builder /usr/src/app/data ./data

HEALTHCHECK --interval=5s --timeout=5s --retries=3 CMD curl -f $API_ORIGIN/health && curl -f $CORS_ORIGIN || exit 1

EXPOSE 5000 5001
VOLUME ["/usr/src/app/data"]

CMD ["npm", "start"]
