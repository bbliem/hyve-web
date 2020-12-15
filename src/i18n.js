import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { config } from './config'

Vue.use(VueI18n)

function loadLocaleMessages () {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

var i18n = new VueI18n({
  locale: localStorage.getItem('locale') || config.i18nLocale,
  fallbackLocale: config.i18nFallbackLocale,
  messages: loadLocaleMessages()
})

Object.defineProperty(i18n, 'localeCapitalized', {
  get: function() {
    return this.locale.charAt(0).toUpperCase() + this.locale.slice(1)
  }
})

export default i18n
