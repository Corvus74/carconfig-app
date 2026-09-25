// Set CARCONFIG_API_TARGET to the backend URL reachable from the machine
// running ng serve (for example, http://host.docker.internal:8090 in a devcontainer).
const backendTarget = process.env.CARCONFIG_API_TARGET || "http://localhost:8090";

const PROXY_CONFIG = {
  "/api": {
    "target": backendTarget,
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
};

console.log(`Angular API proxy target: ${backendTarget}`);

module.exports = PROXY_CONFIG;
