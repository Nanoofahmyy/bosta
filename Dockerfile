# Use the official Node.js image as a base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Expose the port your application listens on
EXPOSE 5000

# Define the command to start your Node.js application
CMD ["node", "server.js" , "npm" , "test"]
