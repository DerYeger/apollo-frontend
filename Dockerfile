FROM node:21.4.0-alpine@sha256:34556ba78497768394c896cca78c490f620e624ddacd4ebe47380c52e3e5cf79 AS BUILDER

WORKDIR /usr/app

COPY . .

ARG BACKEND_URL=http://localhost:8080

RUN sed -i "s|{{BACKEND_URL}}|$BACKEND_URL|g" src/environments/environment.prod.ts &&\
    yarn install &&\
    yarn build

FROM nginx:1.25.3-alpine@sha256:156d75f07c59b2fd59d3d1470631777943bb574135214f0a90c7bb82bde916da

COPY --from=BUILDER /usr/app/dist/apollo-frontend/ /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY config/nginx /etc/nginx
