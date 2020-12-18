FROM node:14.15.3-alpine As builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build --prod

FROM nginx:1.19.6-alpine

COPY --from=builder /usr/src/app/dist/gramofo-frontend/ /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY config/nginx/gramofo.conf /etc/nginx/conf.d/
