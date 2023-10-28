FROM node:21.1.0-alpine@sha256:df76a9449df49785f89d517764012e3396b063ba3e746e8d88f36e9f332b1864 AS BUILDER

WORKDIR /usr/app

COPY . .

ARG BACKEND_URL=http://localhost:8080

RUN sed -i "s|{{BACKEND_URL}}|$BACKEND_URL|g" src/environments/environment.prod.ts &&\
    yarn install &&\
    yarn build

FROM nginx:1.25.3-alpine@sha256:db353d0f0c479c91bd15e01fc68ed0f33d9c4c52f3415e63332c3d0bf7a4bb77

COPY --from=BUILDER /usr/app/dist/apollo-frontend/ /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY config/nginx /etc/nginx
