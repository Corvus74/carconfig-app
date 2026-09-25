# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.18.0
ARG NGINX_VERSION=stable-alpine


FROM node:${NODE_VERSION}-alpine3.24 AS base

WORKDIR /app

# Copy package-related files first to leverage Docker's caching mechanism
COPY package.json package-lock.json ./

# Install project dependencies using npm ci (ensures a clean, reproducible install)
RUN --mount=type=cache,target=/root/.npm npm ci

# =========================================
# Stage: Dev (optional, via --target dev)
# =========================================
FROM base AS dev

RUN apk add --no-cache bash
WORKDIR /workspace

EXPOSE 4200
CMD ["npm", "run", "start"]

# =========================================
# Stage: Builder
# =========================================
FROM base AS builder

RUN apk add --no-cache bash

# Copy the rest of the application source code into the container
COPY . .
# Build the Angular application for production
# The build includes `public/assets/env.template.js` in the output.
RUN npm run build

# Remove sourcemaps from the production output (optional, shrinks image)
RUN find /app/dist -name "*.map" -delete

# =========================================
# Stage: Runner (Nginx serves static files)
# =========================================
FROM nginxinc/nginx-unprivileged:${NGINX_VERSION} AS runner

# Use a built-in non-root user for security best practices
USER nginx

# Copy custom Nginx config
COPY --chown=0:0 nginx.conf /etc/nginx/conf.d/default.conf
# Copy the entrypoint script that will substitute environment variables at runtime.
COPY --chown=0:0 entrypoint.sh /usr/local/bin/entrypoint.sh

# Copy the static build output from the build stage to Nginx's default HTML serving directory.
COPY --chown=0:0 --from=builder /app/dist/browser /usr/share/nginx/html

# Make the entrypoint script executable
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose port 8080 to allow HTTP traffic
EXPOSE 8080

# Basic container healthcheck against the /healthz endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
    CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1

# Use the custom entrypoint script.
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]
