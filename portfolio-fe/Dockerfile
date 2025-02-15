# Use Node.js as the base image for building
FROM node:18 AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the files and build the React app
COPY . .
RUN npm run build

# Use Nginx to serve the built frontend
FROM nginx:latest

# Install netcat-openbsd
RUN apt-get update && apt-get install -y netcat-openbsd

# Copy the built React app from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
