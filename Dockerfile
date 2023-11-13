# Стадия сборки
FROM node:20-alpine3.17 as build

WORKDIR /app
COPY package*.json ./
RUN npm install @babel/plugin-proposal-private-property-in-object --save-dev
RUN npm install
COPY . ./
RUN npm run build

# Стадия запуска
FROM nginx:1.25.2-alpine

# Копирование сборки из стадии build и конфигурационного файла NGINX
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
