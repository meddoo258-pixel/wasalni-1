FROM node:22-slim AS base
RUN npm i -g pnpm@10.4.1

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build client and server
RUN pnpm run build

# Expose port
EXPOSE 3000

# Start server
ENV NODE_ENV=production
ENV PORT=3000
CMD ["node", "dist/index.js"]
