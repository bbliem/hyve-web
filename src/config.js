// Taken from https://medium.com/dzangolab/vue-js-environment-variables-799fc080d736
const config = {
  appTitle: parse(process.env.VUE_APP_TITLE, 'Unnamed App'),
  backendApiUrl: parse(process.env.VUE_APP_BACKEND_API_URL, 'http://127.0.0.1:8000'),
  features: {
    // ...
  }
}

function feature(name) {
  return config.features[name]
}

function parse(value, fallback) {
  if (typeof value === 'undefined') {
    return fallback
  }

  switch (typeof fallback) {
    case 'boolean':
      return !!JSON.parse(value)
    case 'number':
      return JSON.parse(value)
    default:
      return value
  }
}

export {
  config
}

export default {
  install(Vue) {
    Vue.appConfig = config
    Vue.feature = feature
    Vue.prototype.$appConfig = config
    Vue.prototype.$feature = feature
  }
}
