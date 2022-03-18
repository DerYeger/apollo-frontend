FROM node:17.7.1-alpine@sha256:d1d5dc5de1501601c6f5a1bcac25b5d2060f9127663ac41273a6abfcaa68569b AS BUILDER

WORKDIR /usr/app

COPY . .

ARG BACKEND_URL=http://localhost:8080

RUN sed -i "s|{{BACKEND_URL}}|$BACKEND_URL|g" src/environments/environment.prod.ts &&\
    yarn install &&\
    yarn build

FROM nginx:1.21.6-alpine@sha256:1e18d60ec3e83a1a01f07457ba6ce045fd3cb65ad1c2bbbb07beb62cc3037543

COPY --from=BUILDER /usr/app/dist/apollo-frontend/ /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY config/nginx /etc/nginx
