# Start from the browserless/chrome image
ARG VERSION=latest
FROM browserless/chrome:$VERSION

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm ci

# Copy the rest of your application's source code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start your app
CMD [ "npm", "start" ]