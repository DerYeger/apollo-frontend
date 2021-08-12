FROM node:14.17.5-alpine@sha256:6cfd2d4ca5afae0d5c52c1843dab703079ed8040f7fd613b9eae581c63f21440 AS BUILDER

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
