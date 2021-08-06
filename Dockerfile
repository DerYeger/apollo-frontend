FROM node:14.17.4-alpine@sha256:0c80f9449d2690eef49aad35eeb42ed9f9bbe2742cd4e9766a7be3a1aae2a310 AS BUILDER

WORKDIR /usr/app

COPY . .

ARG BACKEND_URL=http://localhost:8080

RUN sed -i "s|{{BACKEND_URL}}|$BACKEND_URL|g" src/environments/environment.prod.ts &&\
    yarn install &&\
    yarn build

FROM nginx:1.21.1-alpine@sha256:ecc131a9a6a16fa7f43b14f96d4ec9a4721afef2f3e68dcd3e1c2025961546e4

COPY --from=BUILDER /usr/app/dist/apollo-frontend/ /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY config/nginx /etc/nginx
