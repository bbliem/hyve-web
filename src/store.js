import Vue from 'vue'
import Category from '@/models/Category'
import User from '@/models/User'
import axios from 'axios'

export const state = Vue.observable({
  categories: [],
  error: null,
  // Use the state only once initialized is true.
  initialized: false,
  loading: false,

  // Authentication
  // cf. https://www.digitalocean.com/community/tutorials/handling-authentication-in-vue-using-vuex
  user: null,
})

export var initPromise;

function clearCredentials() {
  state.user = null
  localStorage.removeItem('userId')
  localStorage.removeItem('token')
  delete axios.defaults.headers.common['Authorization']
}

function restoreLogin() {
  // Restore user data and token from the last visit
  const userId = localStorage.getItem('userId')
  const token = localStorage.getItem('token')
  if(token && userId) {
    axios.defaults.headers.common['Authorization'] = 'Token ' + token
    // Get user data
    return User
      .find(userId)
      .then(response => { state.user = response })
      .catch(clearCredentials)
  } else {
    clearCredentials()
    return Promise.resolve()
  }
}

function fetchMaterial() {
  return Category
    .include('lessons')
    .get()
    .then(response => { state.categories = response })
}

export function init() {
  // Called before Vue is created, returns Promise
  initPromise = restoreLogin()
    .then(() => { state.initialized = true })
    .catch(error => { state.error = error })
  return initPromise
}

export function onVueCreated() {
  // To be called after Vue has been created and after init() has completed, returns Promise
  if(!state.error) {
    state.loading = true
    return fetchMaterial()
      .finally(() => { state.loading = false })
      .catch(error => {
        state.error = 'Could not fetch material.'
        console.error(state.error, error)
      })
  } else {
    return Promise.resolve()
  }
}

export function login(username, password) {
  const loginData = { username, password }
  return axios({ url: Vue.appConfig.backendApiUrl + '/api-token-auth/', data: loginData, method: 'POST' })
    .then(response => {
      state.user = new User(response.data.user)
      state.token = response.data.token
      localStorage.setItem('userId', state.user.id)
      localStorage.setItem('token', state.token)
      axios.defaults.headers.common['Authorization'] = 'Token ' + state.token
    })
    .catch((error) => {
      state.user = null
      state.token = null
      localStorage.removeItem('userId')
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
      throw error
    })
}

export function logout() {
  clearCredentials();
  return Promise.resolve()
}
