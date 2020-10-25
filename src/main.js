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

// inject global axios instance as http client to Model
Model.$http = axios

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
