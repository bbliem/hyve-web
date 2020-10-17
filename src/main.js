import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import './styles/bootstrap-vue.scss'
Vue.use(BootstrapVue)
//
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
