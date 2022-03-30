FROM node:17.8.0-alpine@sha256:0f923922724e7d04a699ceb7b92b8383ec093b4e249804c8bd94886426443bff AS BUILDER

WORKDIR /usr/app

COPY . .

ARG BACKEND_URL=http://localhost:8080

RUN sed -i "s|{{BACKEND_URL}}|$BACKEND_URL|g" src/environments/environment.prod.ts &&\
    yarn install &&\
    yarn build

FROM nginx:1.21.6-alpine@sha256:db7973cb238c8e8acea5982c1048b5987e9e4da60d20daeef7301757de97357a

COPY --from=BUILDER /usr/app/dist/apollo-frontend/ /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY config/nginx /etc/nginx
