import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    name: 'home',
    path: '/',
    component: () => import(/* webpackChunkName: "index" */ '../views/Index.vue')
  },
  {
    path: '/material',
    component: () => import(/* webpackChunkName: "material" */ '../views/Material.vue'),
    children: [
      {
        name: 'category-detail',
        path: ':categoryId',
        //props: true, // Problem: https://stackoverflow.com/questions/49924450/vue-router-how-to-cast-params-as-integers-instead-of-strings
        props: ({params}) => ({categoryId: Number.parseInt(params.categoryId, 10) || 0}),
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "category-detail" */ '../views/CategoryDetail.vue')
      },
      {
        name: 'content-detail',
        path: ':categoryId/:contentId',
        component: () => import(/* webpackChunkName: "content-detail" */ '../views/ContentDetail.vue')
      },
      {
        name: 'material-home',
        path: '',
        component: () => import(/* webpackChunkName: "material-home" */ '../views/MaterialHome.vue')
      }
    ]
  },
  {
    path: '*',
    component: () => import(/* webpackChunkName: "page-not-found" */ '../views/PageNotFound.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
