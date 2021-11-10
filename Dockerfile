FROM node:17.0.1-alpine@sha256:959c4fc79a753b8b797c4fc9da967c7a81b4a3a3ff93d484dfe00092bf9fd584 AS BUILDER

WORKDIR /usr/app

COPY . .

ARG BACKEND_URL=http://localhost:8080

RUN sed -i "s|{{BACKEND_URL}}|$BACKEND_URL|g" src/environments/environment.prod.ts &&\
    yarn install &&\
    yarn build

FROM nginx:1.21.4-alpine@sha256:99a391b906f1c8d16122d0b6d290997df576b17d67de0ba18af6690f9c01ff47

COPY --from=BUILDER /usr/app/dist/apollo-frontend/ /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY config/nginx /etc/nginx
