FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm -v && node -v
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Install netcat-openbsd (or netcat-traditional)
RUN apt-get update && apt-get install -y netcat-openbsd

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]