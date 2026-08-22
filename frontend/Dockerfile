# Build stage
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json* frontend/package*.json* ./
RUN npm ci --prefer-offline --no-audit || npm install --no-audit

COPY . .

RUN if [ -d "frontend/src" ]; then \
      cd frontend && npm install --no-audit && npm run build && cp -r dist /app/dist; \
    else \
      npm run build; \
    fi

# Production stage with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf*
COPY nginx.conf /etc/nginx/conf.d/default.conf*
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
