import RootComponent from './RootComponent'
import { config } from '@/config'

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
        props: { staticPageId: config.homePageId },
        component: () => import(/* webpackChunkName: "static-page" */ '../views/StaticPage.vue')
      },
      ...config.staticPages.map(({name, id}) => ({
        name,
        path: name,
        props: { staticPageId: id },
        component: () => import(/* webpackChunkName: "static-page" */ '../views/StaticPage.vue')
      })),
      {
        name: 'change-password',
        path: 'change-password',
        component: () => import(/* webpackChunkName: "change-password" */ '../views/ChangePassword.vue')
      },
      {
        name: 'admin-login',
        path: 'admin-login',
        component: () => import(/* webpackChunkName: "admin-login" */ '../views/AdminLogin.vue')
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
            component: () => import(/* webpackChunkName: "category-detail" */ '../views/material/CategoryDetail.vue')
          },
          {
            name: 'lesson-detail',
            path: ':categoryId/:lessonId',
            props: (route) => ({
              lessonId: toIntOrUndefined(route.params.lessonId),
              page: toIntOrUndefined(route.query.page)
            }),
            component: () => import(/* webpackChunkName: "lesson-detail" */ '../views/material/LessonDetail.vue')
          },
          {
            name: 'material-home',
            path: '',
            component: () => import(/* webpackChunkName: "material-home" */ '../views/material/MaterialHome.vue')
          },
        ],
      },
      {
        name: 'organization',
        path: 'organization',
        component: () => import(/* webpackChunkName: "organization" */ '../views/Organization.vue'),
        meta: { requiresAuth: true },
      },
      {
        name: 'request-password-reset',
        path: 'request-password-reset',
        component: () => import(/* webpackChunkName: "request-password-reset" */ '../views/RequestPasswordReset.vue')
      },
      {
        name: 'reset-password',
        path: 'reset-password/:uid/:token',
        props: (route) => ({
          uid: route.params.uid,
          token: route.params.token,
        }),
        component: () => import(/* webpackChunkName: "reset-password" */ '../views/ResetPassword.vue')
      },
      {
        name: 'profile',
        path: 'profile',
        component: () => import(/* webpackChunkName: "profile" */ '../views/Profile.vue'),
        meta: { requiresAuth: true },
      },
      {
        name: 'register',
        path: 'register',
        component: () => import(/* webpackChunkName: "register" */ '../views/Register.vue')
      },
    ],
  },
]
