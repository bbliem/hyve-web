import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function toIntOrUndefined(value) {
  return Number.parseInt(value, 10) || undefined
}

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
        props: ({params}) => ({ categoryId: toIntOrUndefined(params.categoryId) }),
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "category-detail" */ '../views/CategoryDetail.vue')
      },
      {
        name: 'lesson-detail',
        path: ':categoryId/:lessonId',
        props: (route) => ({
          lessonId: toIntOrUndefined(route.params.lessonId),
          page: toIntOrUndefined(route.query.page)
        }),
        component: () => import(/* webpackChunkName: "lesson-detail" */ '../views/LessonDetail.vue')
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
    name: 'page-not-found',
    component: () => import(/* webpackChunkName: "page-not-found" */ '../views/PageNotFound.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
