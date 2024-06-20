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
ARG NEXT_PUBLIC_API_ORIGIN=http://localhost:$SERVER_PORT
ARG DATABASE_URL=file:../../data/app.db

RUN npm run batch:writeVersion -- $VERSION
RUN npm run build

FROM node:20-alpine

WORKDIR /usr/src/app

ARG CLIENT_PORT=5001

ENV PORT=5000
ENV CLIENT_PORT=$CLIENT_PORT
ENV COGNITO_USER_POOL_ID=ap-northeast-1_default
ENV COGNITO_USER_POOL_CLIENT_ID=default-client-id
ENV DATABASE_URL=file:../../data/app.db
ENV SMTP_HOST=inbucket
ENV SMTP_PORT=2500
ENV SMTP_USER=fake_mail_user
ENV SMTP_PASS=fake_mail_password

COPY --chown=node package.json .
COPY --chown=node --from=builder /usr/src/app/client/out ./client/out
COPY --chown=node server/package.json server/package-lock.json ./server/

RUN npm ci --omit=dev --prefix server

COPY --chown=node --from=builder /usr/src/app/server/index.js ./server/index.js
COPY --chown=node --from=builder /usr/src/app/server/node_modules/.prisma ./server/node_modules/.prisma
COPY --chown=node --from=builder /usr/src/app/server/prisma ./server/prisma
COPY --chown=node --from=builder /usr/src/app/data ./data

HEALTHCHECK --interval=5s --timeout=5s --retries=3 CMD wget --quiet --spider http://127.0.0.1:$PORT/health && wget --quiet --spider http://127.0.0.1:$CLIENT_PORT || exit 1

EXPOSE ${PORT} ${CLIENT_PORT}
VOLUME ["/usr/src/app/data"]

USER node
CMD ["npm", "start"]
