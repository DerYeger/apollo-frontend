FROM node:17.9.1-alpine@sha256:76e638eb0d73ac5f0b76d70df3ce1ddad941ac63595d44092b625e2cd557ddbf AS BUILDER

WORKDIR /usr/app

COPY . .

ARG BACKEND_URL=http://localhost:8080

RUN sed -i "s|{{BACKEND_URL}}|$BACKEND_URL|g" src/environments/environment.prod.ts &&\
    yarn install &&\
    yarn build

FROM nginx:1.23.3-alpine@sha256:dd8a054d7ef030e94a6449783605d6c306c1f69c10c2fa06b66a030e0d1db793

COPY --from=BUILDER /usr/app/dist/apollo-frontend/ /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY config/nginx /etc/nginx
