FROM node:21.0.0-alpine@sha256:39bf945d56c29e7b3fa51632a7a07080475e5d5e5fc981543cdb735bc3bc01eb AS BUILDER

WORKDIR /usr/app

COPY . .

ARG BACKEND_URL=http://localhost:8080

RUN sed -i "s|{{BACKEND_URL}}|$BACKEND_URL|g" src/environments/environment.prod.ts &&\
    yarn install &&\
    yarn build

FROM nginx:1.25.2-alpine@sha256:7272a6e0f728e95c8641d219676605f3b9e4759abbdb6b39e5bbd194ce55ebaf

COPY --from=BUILDER /usr/app/dist/apollo-frontend/ /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY config/nginx /etc/nginx
