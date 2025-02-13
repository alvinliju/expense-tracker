# Use Bun as the base image
FROM oven/bun:1 as builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY bun.lock ./

# Copy frontend-specific files
COPY frontend/package*.json frontend/
COPY frontend/bun.lock frontend/

# Install dependencies at root level
RUN bun install

# Install frontend dependencies
WORKDIR /app/frontend
RUN bun install

# Copy frontend source
COPY frontend/ ./

# Build frontend
RUN bun run build

# Back to root to copy and build backend
WORKDIR /app

# Copy backend source
COPY server/ server/
COPY tsconfig.json ./

# Production image
FROM oven/bun:1

WORKDIR /app

# Copy built frontend and backend from builder
COPY --from=builder /app/frontend/dist ./frontend/dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/bun.lock ./
COPY --from=builder /app/tsconfig.json ./

# Install production dependencies only
RUN bun install --production

# Expose port
EXPOSE 3000

# Start the application
CMD ["bun", "server/index.ts"]