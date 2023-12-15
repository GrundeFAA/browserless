# Start from the browserless/chrome image
ARG VERSION=latest
FROM browserless/chrome:$VERSION

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Create a new user 'appuser' and switch to it.
# This is a security best practice in Docker.
RUN adduser --disabled-password --gecos '' appuser
RUN chown -R appuser /usr/src/app
USER appuser

# Install app dependencies
RUN npm install --omit=dev

# Bundle app source
COPY --chown=appuser:appuser . .

# Expose the port your app runs on
EXPOSE 3000

# Start your app
CMD [ "npm", "start" ]
