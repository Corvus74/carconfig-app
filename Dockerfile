# syntax=docker/dockerfile:1

ARG NODE_VERSION=25.1.0
ARG NGINX_VERSION=stable-alpine


FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

# Copy package-related files first to leverage Docker's caching mechanism
COPY package.json package-lock.json ./

# Install project dependencies using npm ci (ensures a clean, reproducible install)
RUN --mount=type=cache,target=/root/.npm npm ci

# Copy the rest of the application source code into the container
COPY . .
# Build the Angular application for production
# This build will include your `src/assets/env.template.js` file in the output.
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
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf
# Copy the entrypoint script that will substitute environment variables at runtime.
COPY --chown=nginx:nginx entrypoint.sh /usr/local/bin/entrypoint.sh

# Copy the static build output from the build stage to Nginx's default HTML serving directory.
# The `nginxinc/nginx-unprivileged` image listens on port 8080 and serves from
# `/usr/share/nginx/html` by default. We only need to copy our files there.
# The `/app/dist` path from the builder stage is a standard output path for Angular.
COPY --chown=nginx:nginx --from=builder /app/dist/browser /usr/share/nginx/html


# Make the entrypoint script executable
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose port 8080 to allow HTTP traffic
# Note: The default NGINX container now listens on port 8080 instead of 80
EXPOSE 8080

# Use the custom entrypoint script. This script will prepare the environment
# and then execute the command passed to it (the CMD).
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# The default CMD from the nginxinc/nginx-unprivileged image is ["nginx", "-g", "daemon off;"]
# This will be passed as arguments to our ENTRYPOINT, which will execute it after
# setting up the environment variables.
CMD ["nginx", "-g", "daemon off;"]
