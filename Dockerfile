# Use an official Node.js runtime as the base image for the build stag
FROM node:16 as builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the project files to the container
COPY . .

# Build the React project
RUN npm run build

# Use the official Nginx image as the base for the serving stage
FROM nginx:alpine

# Copy the built files from the builder stage to the Nginx server's web root directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the custom nginx configuration file into the container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port that the Nginx server will run on
EXPOSE 80

# The Nginx container automatically starts Nginx, so no CMD is needed