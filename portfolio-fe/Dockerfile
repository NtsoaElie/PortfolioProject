FROM node:18 AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm -v && node -v  # Add this line to verify npm and node are installed
RUN npm install --legacy-peer-deps

# Copy the rest of the files and build the React app
COPY . .
RUN npm run build

# --- IMPORTANT: Add netcat installation here ---
# Choose the correct method based on your base image
# Debian/Ubuntu based images:
RUN apt-get update && apt-get install -y netcat

# Alpine Linux based images (if you change the FROM line):
# RUN apk add --no-cache netcat

# --- End of netcat installation ---

# You might need a separate stage for serving the built app
# if you're not serving directly from the build stage

# Example using Nginx (common for serving React apps):
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

# If you need to copy any other configuration files for nginx
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80  # Or whatever port your app uses
CMD ["nginx", "-g", "daemon off;"]