# hyve-web

## Project setup
```
npm install
```

Copy `.env.example` to `.env` (or, if it shouldn't be in version control, to `.env.local`) and adapt the values to your needs. You can also use `.env.development`, `.env.production` or `.env.test` for the respective mode in which you want the configuration to be active.

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Environment variables

- `VUE_APP_TITLE`: Title of the app
- `VUE_APP_BACKEND_API_URL`: Root URL of the backend API
- `VUE_APP_I18N_LOCALE`: Locale to use by default (string, e.g., "en")
- `VUE_APP_I18N_FALLBACK_LOCALE`: Locale(s) to use for messages not available in the chosen locale. If the value is parsable as JSON, it can be used as an array or decision map according to the [Vue i18n documentation](https://kazupon.github.io/vue-i18n/guide/fallback.htm). Otherwise the value will be used directly.
