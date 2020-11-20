import RootComponent from './RootComponent.vue'

function toIntOrUndefined(value) {
  return Number.parseInt(value, 10) || undefined
}

export default [
  {
    path: '/:locale',
    component: RootComponent,
    children: [
      {
        name: 'home',
        path: '',
        props: { staticPageId: 1 }, // FIXME think of something better than hard-coding a PK
        component: () => import(/* webpackChunkName: "static-page" */ '../views/StaticPage.vue')
      },
      {
        name: 'about',
        path: 'about',
        props: { staticPageId: 2 }, // FIXME think of something better than hard-coding a PK
        component: () => import(/* webpackChunkName: "static-page" */ '../views/StaticPage.vue')
      },
      {
        name: 'login',
        path: 'login',
        component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
      },
      {
        path: 'material',
        props: ({params}) => ({
          activeCategoryId: toIntOrUndefined(params.categoryId)
        }),
        component: () => import(/* webpackChunkName: "material" */ '../views/Material.vue'),
        meta: { requiresAuth: true },
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
          },
        ],
      },
    ],
  },
]