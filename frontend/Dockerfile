# Build Stage
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./

# Install all packages and force-install vite binary
RUN npm install
RUN npm install -D vite @vitejs/plugin-react

COPY . .

# Run Vite build
RUN npx vite build

# Production Stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]