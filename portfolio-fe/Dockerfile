FROM node:16

WORKDIR /app

# Install nc (netcat)
RUN apt-get update && apt-get install -y netcat

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

CMD ["npm", "start"]
