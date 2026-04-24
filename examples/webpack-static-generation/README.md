# Webpack static generation example

This example fetches translations during Webpack build and generates localized static HTML files with `HtmlWebpackPlugin`.

## Use case

Use this setup for static websites, portfolio pages, landing pages, or marketing pages where translations should be embedded into HTML at build time.

## Environment

```bash
I18N_API_URL=http://localhost:7996/v1/projects/portfolio/translations
DEFAULT_LANGUAGE=en
TRANSLATION_TAGS=landing,about,sitemap
```

## API call

The example calls:

```http
GET /v1/projects/:project/translations/:lang?tag=landing&format=nested
```

The returned object is passed to templates as `text`.
