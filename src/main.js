import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import './styles/bootstrap-vue.scss'
import ConfigPlugin from '@/config'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import { Model } from 'vue-api-query'
import { init } from '@/store'

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

const token = localStorage.getItem('token')
if(token) {
  Model.$http.defaults.headers.common['Authorization'] = token
}

Vue.use(BootstrapVue)
Vue.use(ConfigPlugin)

Vue.config.productionTip = false

new Vue({
  router,
  created() {
    init()
  },
  render: h => h(App)
}).$mount('#app')
