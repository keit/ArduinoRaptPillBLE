# Use Node.js v18.18.0 base image
FROM node:18.18.0-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy all the source files
COPY /*.* .

RUN ls -l /app
# Expose the port that the Express.js app runs on
EXPOSE 3000

# Start the Express.js application
CMD ["npm", "run", "express"]
