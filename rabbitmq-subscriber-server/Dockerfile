FROM node:18

# Set the working directory inside the container
WORKDIR /rabbitmq-subscriber-server

COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

# Define the command to run your app
CMD ["node", "main.js"]
