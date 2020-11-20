import Vue from 'vue'
import VueRouter from 'vue-router'
import i18n from '@/i18n'
import localeRoutes from './localeRoutes'
import { state, initPromise as storeInitialized } from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: i18n.locale,
  },
  ...localeRoutes,
  {
    path: '*',
    name: 'page-not-found',
    component: () => import(/* webpackChunkName: "page-not-found" */ '../views/PageNotFound.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    // This route requires auth, check if logged in; if not, redirect to login page.
    // We need to wait until the state is initialized before we can use `state.user`.
    storeInitialized.then(() => {
      if(state.user) {
        next()
      } else {
        next({ name: 'login', query: { redirect: to.fullPath }})
      }
    })
  } else {
    next()
  }
})

router.beforeEach((to, from, next) => {
  const locale = to.params.locale
  if(!i18n.availableLocales.includes(locale)) {
    console.error("Locale not available:", locale)
    return next(i18n.locale)
  }
  i18n.locale = locale
  return next()
})

export default router
