(function(window) {
  window.env = window.env || {};

  // Environment variables are injected at runtime by the entrypoint script
  window.env.apiUrl = "${API_URL}";
})(this);
