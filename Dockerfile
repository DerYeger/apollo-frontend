FROM node:17.7.1-alpine@sha256:1cc03b302881bab0afe450fd51138718c81156d107427dbebb3c2301819620a7 AS BUILDER

WORKDIR /usr/app

COPY . .

ARG BACKEND_URL=http://localhost:8080

RUN sed -i "s|{{BACKEND_URL}}|$BACKEND_URL|g" src/environments/environment.prod.ts &&\
    yarn install &&\
    yarn build

FROM nginx:1.21.6-alpine@sha256:581ac1da0f8f8c342fa6cf77885a2320227667c0bc42bdca4b1dd74599d02498

COPY --from=BUILDER /usr/app/dist/apollo-frontend/ /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY config/nginx /etc/nginx
