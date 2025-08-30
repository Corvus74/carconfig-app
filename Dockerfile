# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.5.0
ARG NGINX_VERSION=alpine3.21

# =========================================
# Stage 1: Build the Angular application
# =========================================
FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

# Copy package-related files first to leverage Docker's caching mechanism
COPY package.json package-lock.json ./

# Install project dependencies using npm ci (ensures a clean, reproducible install)
RUN --mount=type=cache,target=/root/.npm npm ci

# Copy the rest of the application source code into the container
COPY . .

# Build the Angular application for production
# The output directory name for 'ng build' is usually the project name
# by default, which is why the 'dist/*/browser' path is a good practice.
# But it's more specific to use the project name or specify the output path.
RUN npm run build -- --output-path=dist

# =========================================
# Stage 2: Prepare Nginx to Serve Static Files
# =========================================
FROM nginxinc/nginx-unprivileged:${NGINX_VERSION} AS runner

# Use a built-in non-root user for security best practices
USER nginx

# Copy custom Nginx config
# It's better to copy to /etc/nginx/conf.d and use a file named default.conf
# because the default nginx.conf is complex and it's easier to override
# the default behavior with a new config file in the conf.d directory.
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the static build output from the build stage to Nginx's default HTML serving directory.
# The `nginxinc/nginx-unprivileged` image listens on port 8080 and serves from
# `/usr/share/nginx/html` by default. We only need to copy our files there.
# The `/app/dist` path from the builder stage is a standard output path for Angular.
COPY --chown=nginx:nginx --from=builder /app/dist /usr/share/nginx/html

# Expose port 8080 to allow HTTP traffic
# Note: The default NGINX container now listens on port 8080 instead of 80
EXPOSE 8080

# The base nginx image already has a CMD that runs `nginx -g 'daemon off;'`.
# Overwriting this with both `ENTRYPOINT` and `CMD` is redundant and can cause issues.
# It's best to let the base image handle the `ENTRYPOINT` and `CMD` unless you have
# a specific reason to change it.
CMD ["nginx", "-g", "daemon off;"]
