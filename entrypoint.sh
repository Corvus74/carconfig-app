#!/bin/sh
# This script is executed when the container starts.
# It substitutes environment variables in the JavaScript configuration file.

set -e

# Path to the template and final config file
TEMPLATE_FILE="/usr/share/nginx/html/assets/env.template.js"
OUTPUT_FILE="/usr/share/nginx/html/assets/env.js"

# Check that the required environment variable is set.
# The :? operator will cause the script to exit with an error if API_URL is unset or empty.
: "${API_URL:?Please set the API_URL environment variable}"
export API_URL

# Use envsubst to perform the substitution.
# The 'envsubst' command will replace ${API_URL} in the template file
# with the value of the API_URL environment variable.
envsubst '${API_URL}' < "$TEMPLATE_FILE" > "$OUTPUT_FILE"

# The original command for the nginx container is `nginx -g 'daemon off;'`.
# "$@" passes all arguments passed to this script to the `exec` command.
# `exec` replaces the current shell process with the nginx process.
exec "$@"
