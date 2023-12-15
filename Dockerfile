# Use a specific version of the official Node.js image
FROM node:16-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Create a directory for the PDF files within the container
# This is where your application will save the PDF files
RUN mkdir -p /usr/src/app/pdf
RUN chmod 777 /usr/src/app/pdf

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Puppeteer dependencies
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    procps \
    libxss1 \
    libasound2 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    libnss3 \  # Added library
    && rm -rf /var/lib/apt/lists/*

# Install app dependencies
RUN npm ci

# Copy the rest of your application's source code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start your app
CMD [ "npm", "start" ]
