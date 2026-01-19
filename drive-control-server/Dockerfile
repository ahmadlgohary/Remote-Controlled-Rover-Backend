FROM node:18

# Set the working directory inside the container
WORKDIR /drive-control-server

COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

EXPOSE 8443

# Define the command to run your app
CMD ["node", "main.js"]
