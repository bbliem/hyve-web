module.exports = {
  publicPath: process.env.BASE_URL,

  devServer: {
    host: 'localhost'
  },

  css: {
    loaderOptions: {
      sass: {
        // https://css-tricks.com/how-to-import-a-sass-file-into-every-vue-component-in-an-app/
        additionalData: `@import "@/styles/bootstrap-theme-overrides.scss";`
      }
    }
  },

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'fi',
      localeDir: 'locales',
      enableInSFC: false
    }
  }
}
