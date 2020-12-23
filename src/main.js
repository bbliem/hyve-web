import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import VueMeta from 'vue-meta'
import VueRouter from 'vue-router'

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import './styles/bootstrap-vue.scss'

import axios from 'axios'
import { Model } from 'vue-api-query'

import App from './App.vue'
import ConfigPlugin from './config'
import LocalizedLink from './components/LocalizedLink'
import StorePlugin from './store'
import i18n from './i18n'
import router from './router'

// Use trailing slashes for endpoints, as expected by our backend.
// Unfortunately there is no way to make vue-api-query use trailing slashes, so
// we have to resort to intercepting Axios requests.
axios.defaults.addTrailingSlash = true;
axios.interceptors.request.use((config) => {
  if(config.addTrailingSlash) {
    let pathLength = config.url.length
    const queryStart = config.url.indexOf('?')
    if(queryStart !== -1) {
      pathLength = queryStart
    }
    const fragmentStart = config.url.indexOf('#')
    if(fragmentStart !== -1 && fragmentStart < pathLength) {
      pathLength = fragmentStart
    }
    const path = config.url.slice(0, pathLength)
    if(!path.endsWith('/')) {
      // Add slash at the end of the path component of the URL
      const suffix = config.url.slice(pathLength)
      config.url = path + '/' + suffix
    }
  }
  return config;
});
// Inject global axios instance as HTTP client to Model.
Model.$http = axios

Vue.component('LocalizedLink', LocalizedLink)
Vue.use(BootstrapVue, {
  BLink: { routerComponentName: 'LocalizedLink' },
})
Vue.use(BootstrapVueIcons)
Vue.use(ConfigPlugin)
Vue.use(StorePlugin)
Vue.use(VueMeta)
Vue.use(VueRouter)

Vue.config.productionTip = false

new Vue({
  i18n,
  router,
  render: h => h(App)
}).$mount('#app')
