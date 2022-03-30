FROM node:17.8.0-alpine@sha256:0f923922724e7d04a699ceb7b92b8383ec093b4e249804c8bd94886426443bff AS BUILDER

WORKDIR /usr/app

COPY . .

ARG BACKEND_URL=http://localhost:8080

RUN sed -i "s|{{BACKEND_URL}}|$BACKEND_URL|g" src/environments/environment.prod.ts &&\
    yarn install &&\
    yarn build

FROM nginx:1.21.6-alpine@sha256:44e208ac2000daeff77c27a409d1794d6bbdf52067de627c2da13e36c7d59582

COPY --from=BUILDER /usr/app/dist/apollo-frontend/ /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY config/nginx /etc/nginx
