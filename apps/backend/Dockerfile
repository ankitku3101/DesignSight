FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies (include dev dependencies for tsc)
RUN npm install

# Copy rest of the backend source code
COPY . .

# Build TypeScript -> dist/
RUN npm run build

# Expose API port
EXPOSE 5000

# Start from compiled dist/index.js
CMD ["npm", "start"]
