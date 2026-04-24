# Examples

This folder contains integration examples for using Google Sheets i18n Server in different application setups.

## Examples

### `webpack-static-generation`

Build-time integration for static websites.

Translations are fetched from the i18n API during Webpack build and passed into `HtmlWebpackPlugin`. This allows generating localized static HTML pages without runtime requests from the browser.

Use this approach when:

- pages are generated at build time
- translations should be embedded into HTML
- SEO matters
- the site does not need runtime language switching

### `webpack-plugin`

Reusable Webpack plugin that downloads translations during build and writes JSON translation bundles into the output directory.

Use this approach when:

- your app already loads translation JSON files
- you want to keep compatibility with existing i18n clients
- translations should be versioned with build hash

### `runtime-i18next`

Runtime integration with `i18next`.

Use this approach when:

- translations are loaded in the browser
- language can change without rebuild
- the app already uses `i18next` or a compatible loader
