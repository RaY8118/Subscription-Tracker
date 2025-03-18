# Use the offical Node.js image from the Docker Hub
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first for better caching of dependencies
COPY package*.json ./

# Install the dependencies in the container
RUN npm install

# Copy the rest of teh app's source code into the container
COPY . .

# Expose the port the app will run on
EXPOSE 5500

# Run the app
CMD ["npm", "start"]
