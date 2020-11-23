import Vue from 'vue'
import Category from '@/models/Category'
import User from '@/models/User'
import axios from 'axios'

export const state = Vue.observable({
  categories: [],
  error: null,
  // Use the state only once initialized is true.
  initialized: false,
  fetchingMaterial: false,
  fetchedMaterial: false,
  editMode: false,

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

function setAuthorizationHeader(token) {
  axios.defaults.headers.common['Authorization'] = 'Token ' + token
}

function restoreLogin() {
  // Restore user data and token from the last visit
  const userId = localStorage.getItem('userId')
  const token = localStorage.getItem('token')
  if(token && userId) {
    setAuthorizationHeader(token)
    // Get user data
    return User
      .include('section_completions')
      .params({ omit: 'completed_sections' })
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
    state.fetchingMaterial = true
    return fetchMaterial()
      .finally(() => {
        state.fetchingMaterial = false
        state.fetchedMaterial = true
      })
      .catch(error => {
        state.error = this.$t('could-not-load-material')
        console.error(state.error, error)
      })
  } else {
    return Promise.resolve()
  }
}

function updateObjectIfSameId(old, updated) {
  // Update `old` so that, for all keys in `old`, `old[key]` will be equal to `updated[key]`, but keys in `updated` that are not in `old` will not be added.
  if(old.id === updated.id) {
    for(const key of Object.keys(old)) {
      if(key in updated) {
        old[key] = updated[key]
      }
    }
  }
}

export function onUpdateLesson(updatedLesson) {
  for(const category of state.categories) {
    for(const lesson of category.lessons) {
      updateObjectIfSameId(lesson, updatedLesson)
    }
  }
}

export function onUpdateCategory(updatedCategory) {
  for(const category of state.categories) {
    updateObjectIfSameId(category, updatedCategory)
  }
}

export function login(username, password) {
  const loginData = { username, password }
  return axios({ url: Vue.appConfig.backendApiUrl + '/api-token-auth/', data: loginData, method: 'POST' })
    .then(response => {
      state.user = new User(response.data.user)
      const token = response.data.token
      localStorage.setItem('userId', state.user.id)
      localStorage.setItem('token', token)
      setAuthorizationHeader(token)
      return state.user
    })
    .catch((error) => {
      clearCredentials()
      throw error
    })
}

export function logout() {
  clearCredentials();
  return Promise.resolve()
}
