FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Build for production
RUN npm run build -- --configuration production

FROM nginx:alpine
COPY --from=build /app/dist/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
