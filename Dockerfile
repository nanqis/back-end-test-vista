# Stage 1: Build the TypeScript application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
RUN npx prisma generate

# Copy the rest of the source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Create a minimal, production-ready image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules/
COPY --from=builder /app/dist ./dist/
COPY --from=builder /app/prisma ./prisma/

# Expose the port
EXPOSE 3000

# Set the command to run the application
CMD ["npm", "start"]