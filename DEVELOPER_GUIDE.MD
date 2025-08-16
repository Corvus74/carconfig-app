### API Documentation
The CARCONFIG API provides interactive API documentation and OpenAPI specifications. You can access them using the following URLs:

- **Swagger UI**: [http://localhost:8090/api/swagger-ui/index.html](http://localhost:8090/api/swagger-ui/index.html)
- **OpenAPI Docs**: [http://localhost:8090/api/v3/api-docs](http://localhost:8090/api/v3/api-docs)

Annotations like `@OpenAPIDefinition` and `@SecurityScheme` are used to define API metadata and security schemes. This automatically generates API documentation for all REST endpoints, accessible via Swagger UI.

## API Generation

The project uses **OpenAPI Generator** (version 7.14.0) to generate API services and models. This ensures consistency between the backend API and the frontend services.

### Configuration

The OpenAPI Generator is configured in the `openapitools.json` file:

```json
{
  "$schema": "./node_modules/@openapitools/openapi-generator-cli/config.schema.json",
  "spaces": 2,
  "generator-cli": {
    "version": "7.14.0"
  }
}
```

### Usage

To regenerate the API services and models, run the following command:

```bash
npx @openapitools/openapi-generator-cli generate -i http://localhost:8090/api/v3/api-docs -g typescript-angular -o \src\app\core\api
```

Replace `<path-to-openapi-spec>` with the path to the OpenAPI specification file and `<output-directory>` with the desired output directory
