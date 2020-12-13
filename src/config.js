// Taken from https://medium.com/dzangolab/vue-js-environment-variables-799fc080d736
const config = {
  appTitle: parse(process.env.VUE_APP_TITLE, 'Unnamed App'),
  avatarMaxFileSize: parse(process.env.VUE_APP_AVATAR_MAX_FILE_SIZE, 4024*1024),
  avatarSize: parse(process.env.VUE_APP_AVATAR_SIZE, '4rem'),
  backendApiUrl: parse(process.env.VUE_APP_BACKEND_API_URL, 'http://127.0.0.1:8000'),
  logoExtension: parse(process.env.VUE_APP_LOGO_EXTENSION, '.png'),
  logoHeight: parse(process.env.VUE_APP_LOGO_HEIGHT, '70'),
  organization: parse(process.env.VUE_APP_ORGANIZATION_ID),
  showLogo: parse(process.env.VUE_APP_SHOW_LOGO, true),

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
