FROM node:14.15.3-alpine As builder

WORKDIR /usr/src/app

COPY . .

ARG BACKEND_URL=http://localhost:8080

RUN sed -i "s|{{BACKEND_URL}}|$BACKEND_URL|g" src/environments/environment.prod.ts &&\
    npm install &&\
    npm run build --prod

FROM nginx:1.19.6-alpine

COPY --from=builder /usr/src/app/dist/gramofo-frontend/ /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY config/nginx/gramofo.conf /etc/nginx/conf.d/
