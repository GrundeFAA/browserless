# Start from the browserless/chrome image
ARG VERSION=latest
FROM browserless/chrome:$VERSION

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install Node.js dependencies
RUN npm install --only=production

# Copy the rest of your application's source code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD [ "npm", "start" ]