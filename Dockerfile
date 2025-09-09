# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Expose Next.js default port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
