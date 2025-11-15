# Use Node.js 20
FROM node:20-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source files
COPY . .

# Expose port
EXPOSE 4000

# Start server
CMD ["node", "src/server.js"]
