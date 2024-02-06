# Stage 1: Build the application
FROM node:16-alpine as build

WORKDIR /app
RUN npm install -g pnpm
COPY pnpm-lock.yaml ./
RUN pnpm fetch
COPY package.json ./
RUN pnpm install -r --offline


# Copy rest of the application
COPY . .
RUN pnpm build


# Stage 2: Serve the application with Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/dist .


ENTRYPOINT ["nginx", "-g", "daemon off;"]
