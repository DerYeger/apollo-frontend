FROM node:14.17.5-alpine@sha256:b8d48b515e3049d4b7e9ced6cedbe223c3bc4a3d0fd02332448f3cdb000faee1 AS BUILDER

WORKDIR /usr/app

COPY . .

ARG BACKEND_URL=http://localhost:8080

RUN sed -i "s|{{BACKEND_URL}}|$BACKEND_URL|g" src/environments/environment.prod.ts &&\
    yarn install &&\
    yarn build

FROM nginx:1.21.1-alpine@sha256:f5c8441e8254e8ecb5e8bb319c27805fe6a6ea0d489a95bb45f4208db633b38a

COPY --from=BUILDER /usr/app/dist/apollo-frontend/ /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY config/nginx /etc/nginx
