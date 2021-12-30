FROM node:17.3.0-alpine@sha256:4522cc108ad7c055b71f545596bfc07632d9f9a41125ea12eabe8f04114807f3 AS BUILDER

WORKDIR /usr/app

COPY . .

ARG BACKEND_URL=http://localhost:8080

RUN sed -i "s|{{BACKEND_URL}}|$BACKEND_URL|g" src/environments/environment.prod.ts &&\
    yarn install &&\
    yarn build

FROM nginx:1.21.5-alpine@sha256:eb05700fe7baa6890b74278e39b66b2ed1326831f9ec3ed4bdc6361a4ac2f333

COPY --from=BUILDER /usr/app/dist/apollo-frontend/ /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY config/nginx /etc/nginx
