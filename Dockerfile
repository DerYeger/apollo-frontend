FROM node:20.0.0-alpine@sha256:cc4e8f3d78a276fa05eae1803b6f8cbb43145441f54c828ab14e0c19dd95c6fd AS BUILDER

WORKDIR /usr/app

COPY . .

ARG BACKEND_URL=http://localhost:8080

RUN sed -i "s|{{BACKEND_URL}}|$BACKEND_URL|g" src/environments/environment.prod.ts &&\
    yarn install &&\
    yarn build

FROM nginx:1.23.3-alpine@sha256:6318314189b40e73145a48060bff4783a116c34cc7241532d0d94198fb2c9629

COPY --from=BUILDER /usr/app/dist/apollo-frontend/ /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY config/nginx /etc/nginx
