FROM node:18 AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm -v && node -v  # Add this line to verify npm and node are installed
RUN npm install --legacy-peer-deps

# Copy the rest of the files and build the React app
COPY . .
RUN npm run build
