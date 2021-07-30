FROM node:14.17.4-alpine@sha256:45f77598a41d32bd1daf40cc27822273d2386985662b3faafcbb4f92cd19ec87 AS BUILDER

WORKDIR /usr/app

COPY . .

ARG BACKEND_URL=http://localhost:8080

RUN sed -i "s|{{BACKEND_URL}}|$BACKEND_URL|g" src/environments/environment.prod.ts &&\
    yarn install &&\
    yarn build

FROM nginx:1.21.1-alpine@sha256:e22b3ba90be2990777d7d865ec13cb2ac1ebe1c9aa4828b373dae26624191646

COPY --from=BUILDER /usr/app/dist/apollo-frontend/ /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY config/nginx /etc/nginx
