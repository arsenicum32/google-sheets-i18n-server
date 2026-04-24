# Runtime i18next example

This example loads translations from the i18n server at runtime and registers them in `i18next`.

## Request

```http
GET /v1/projects/:project/translations/:lang?format=nested
```

## Notes

Use this approach when runtime language switching is needed or when translations should not be embedded into the build output.
