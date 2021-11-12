FROM node:17.1.0-alpine@sha256:707d4ffcaafe2bcc9f279fcd40591e0f6eb997be7f1f886796da2c17af871124 AS BUILDER

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
