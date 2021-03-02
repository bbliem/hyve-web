module.exports = {
  publicPath: process.env.BASE_URL,

  devServer: {
    host: 'localhost'
  },

  // Workaround https://github.com/webpack/webpack/issues/5429#issuecomment-731916978
  configureWebpack: {
    optimization: {
      concatenateModules: false,
      providedExports: false,
      usedExports: false
    }
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
      locale: 'fi',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  }
}
