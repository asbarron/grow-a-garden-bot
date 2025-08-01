# Use the official Microsoft Playwright base with all browser deps preinstalled
FROM mcr.microsoft.com/playwright:v1.54.2-jammy

# Create app directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install all deps (Playwright already installed in base image)
RUN npm install

# Copy the rest of your app
COPY . .

# Optional: Build TS if needed
RUN npm run build

# Run the app (entrypoint will be index.js from your build)
CMD ["node", "dist/index.js"]
