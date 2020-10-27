import Vue from 'vue'
import Category from '@/models/Category'
import axios from 'axios'

export const state = Vue.observable({
  categories: [],
  error: null,
  initialized: false,
  loading: false,

  // Authentication
  // cf. https://www.digitalocean.com/community/tutorials/handling-authentication-in-vue-using-vuex
  loggedIn: false,
	user: null,
  token: localStorage.getItem('token') || ''
})

export function init() {
  state.loading = true
  return Category
    .include('lessons')
    .params({omit: 'lessons.contents'})
    .get()
    .then(response => {
      state.categories = response
      state.initialized = true
    })
    .catch(error => {
      state.error = 'Could not load categories.'
      console.error(state.error, error)
    })
    .finally(() => state.loading = false)
}

export function login(username, password) {
  return new Promise((resolve, reject) => {
    const loginData = { username, password }
    axios({ url: Vue.appConfig.backendApiUrl + '/api-token-auth/', data: loginData, method: 'POST' })
      .then(response => {
        state.loggedIn = true
        state.token = response.data.token
        localStorage.setItem('token', state.token)
        axios.defaults.headers.common['Authorization'] = state.token
				// TODO get user info from API now
        resolve(response)
      })
      .catch(error => {
        state.loggedIn = false
        state.token = ''
        localStorage.removeItem('token')
        reject(error)
      })
  })
}

export function logout() {
  // TODO log out
  state.loggedIn = false
  return new Promise((resolve) => resolve())
}
