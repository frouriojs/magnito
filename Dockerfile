FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json .
RUN npm ci

COPY client/package.json client/package-lock.json ./client/
RUN npm ci --prefix client

COPY server/package.json server/package-lock.json ./server/
RUN npm ci --prefix server

COPY . .
ARG VERSION

RUN cp client/.env.example client/.env
RUN cp server/.env.example server/.env
RUN npm run batch:writeVersion -- $VERSION
RUN npm run build

CMD npm start
