/**
 * This file configures the Angular development server to proxy API requests.
 * Any request to a path starting with `/api` will be forwarded to the target.
 * This avoids CORS issues during local development.
 */
const PROXY_CONFIG = {
  "/api": {
    "target": "http://localhost:8090", // Your backend server address
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  },
  "/order": {
    "target": "http://localhost:8090", // Assuming order API is on the same server
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
};

module.exports = PROXY_CONFIG;
