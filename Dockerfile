FROM node:17.0.1-alpine@sha256:468e8d26c56d3813c5454749309b723faf2c9e3ff48d4c2f374d2f1c5d46045f AS BUILDER

WORKDIR /usr/app

COPY . .

ARG BACKEND_URL=http://localhost:8080

RUN sed -i "s|{{BACKEND_URL}}|$BACKEND_URL|g" src/environments/environment.prod.ts &&\
    yarn install &&\
    yarn build

FROM nginx:1.21.3-alpine@sha256:1ff1364a1c4332341fc0a854820f1d50e90e11bb0b93eb53b47dc5e10c680116

COPY --from=BUILDER /usr/app/dist/apollo-frontend/ /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY config/nginx /etc/nginx
