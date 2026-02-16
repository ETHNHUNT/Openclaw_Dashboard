# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Remove server from frontend build context to avoid issues
RUN rm -rf server
RUN npm run build

# Stage 2: Build Backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ ./
RUN npx prisma generate
RUN npm run build

# Stage 3: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app

# Copy backend built files and production dependencies
COPY --from=backend-builder /app/server/dist ./server/dist
COPY --from=backend-builder /app/server/node_modules ./server/node_modules
COPY --from=backend-builder /app/server/package*.json ./server/
COPY --from=backend-builder /app/server/prisma ./server/prisma

# Copy frontend built files to backend's public directory
COPY --from=frontend-builder /app/dist ./server/public

ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL="file:./dev.db"

WORKDIR /app/server
EXPOSE 3000

# Script to run migrations and start the server
RUN echo '#!/bin/sh\nnpx prisma db push\nnode dist/index.js' > /app/start.sh
RUN chmod +x /app/start.sh

CMD ["/app/start.sh"]
