# Build Stage
FROM node:18-alpine AS builder
WORKDIR /app

# Bust Docker build cache so RUN steps are forced to re-execute
ARG CACHE_DATE=2026-10-06

COPY package*.json ./

# Install dependencies including devDependencies explicitly
RUN npm install --include=dev

COPY . .

# Call vite directly from local node_modules binary path
RUN ./node_modules/.bin/vite build

# Production Stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]