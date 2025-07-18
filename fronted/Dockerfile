# Etapa 1: Build del frontend
# Etapa de build
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Etapa de producción
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]
COPY default.conf /etc/nginx/conf.d/default.conf
