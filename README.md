# Interaktiv Alt Text Generator

[![Code analysis checks](https://github.com/interaktivgmbh/volto-alttextgenerator/actions/workflows/code.yml/badge.svg)](https://github.com/interaktivgmbh/volto-alttextgenerator/actions/workflows/code.yml)

The Volto add-on for interaktiv.alttextgenerator

## Features

This addon extends the features of [@interaktivgmbh/volto-alttexts](https://github.com/interaktivgmbh/volto-alttexts).

When you upload an image—whether as an image content type or inside an image
block—a separate request is triggered to generate an AI-based alt text
suggestion. The process is visually indicated with toasts that notify you when
generation starts and when it completes successfully.

For image content types, the generated alt text is automatically inserted into
the alt text field.

For images inside an image block, the alt text is also updated with the newly
generated suggestion.

A checkbox allows you to mark the alt text as AI-generated, and it is checked
by default. When enabled, additional metadata—such as the model used and the
date of generation—is appended to the alt text.

If you manually modify the alt text in the image block sidebar, the checkbox is
automatically unchecked, indicating that the text is no longer considered
AI-generated.

## Installation

Add `@interaktivgmbh/volto-alttextgenerator` to your `package.json`:

```json
"addons": [
    "@interaktivgmbh/volto-alttextgenerator"
]
"dependencies": {
    "@interaktivgmbh/volto-alttextgenerator": "1.0.0"
}
```

Add `@interaktivgmbh/volto-alttextgenerator` to your `volto.config.js`:

```javascript
const addons = ['@interaktivgmbh/volto-alttextgenerator'];
```

## License

The project is licensed under the MIT license.

## Credits and acknowledgements

Generated using [Cookieplone (0.9.10)](https://github.com/plone/cookieplone) and [cookieplone-templates (eae593d)](https://github.com/plone/cookieplone-templates/commit/eae593d854b137cc3ab915e1c638170cbdfb3a78) on 2025-11-21 12:21:53.116148. A special thanks to all contributors and supporters!
