const PROXY_CONFIG = [
  {
    context: [
      "/api/**",
      "/oauth2",
      "/login/oauth2",
      "/exploitation"
    ],
    "target": "http://localhost:8090/",
    "secure": false,
    onProxyReq: (proxyReq) => {
      proxyReq.setHeader('webpass-remote-user','TOTO_USER');
    },
  },
];

module.exports = PROXY_CONFIG;
