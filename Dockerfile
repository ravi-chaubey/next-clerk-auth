# Step 1: Build Stage (This will build the app)
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json from the root directory of the project to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application files into the container
COPY . .

# Build the Next.js app (production build)
RUN npm run build

# Step 2: Production Stage (This will run the app)
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy necessary files from the build stage
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Expose port 3000 for the app
EXPOSE 3000

# Set environment to development or production based on the ENV variable
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# Start the Next.js application in development mode for hot-reloading
CMD ["npm", "run", "dev"]
