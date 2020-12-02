import Vue from 'vue'
import axios from 'axios'

import Organization from '@/models/Organization'
import User from '@/models/User'
import i18n from '@/i18n'

export const state = Vue.observable({
  organization: null,
  editMode: false,
  error: null,
  fetching: false,
  fetched: false,
  // Use the state only once initialized is true.
  initialized: false,
  // Authentication
  // cf. https://www.digitalocean.com/community/tutorials/handling-authentication-in-vue-using-vuex
  user: null,
})

function clearCredentials() {
  state.user = null
  localStorage.removeItem('userId')
  localStorage.removeItem('token')
  delete axios.defaults.headers.common['Authorization']
}

async function fetchOrganization() {
  state.organization = await Organization
    .include('lessons')
    .find(Vue.appConfig.organization)
}

function restoreLogin() {
  // Restore user data and token from the last visit
  const userId = localStorage.getItem('userId')
  const token = localStorage.getItem('token')
  if(token && userId) {
    setAuthorizationHeader(token)
    // Get user data
    return User
      .include('memberships', 'multiple_choice_responses', 'open_question_responses', 'section_completions')
      .params({ omit: 'completed_sections' })
      .find(userId)
      .then(response => { state.user = response })
      .catch(clearCredentials)
  } else {
    clearCredentials()
    return Promise.resolve()
  }
}

function setAuthorizationHeader(token) {
  axios.defaults.headers.common['Authorization'] = 'Token ' + token
}

export var initPromise;

export function init() {
  // Called before Vue is created, returns Promise
  state.editMode = JSON.parse(localStorage.getItem('editMode')) // JSON.parse since localStorage only stores strings at the moment
  initPromise = restoreLogin()
    .then(() => { state.initialized = true })
    .catch(error => { state.error = error })
  return initPromise
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

export function onVueCreated() {
  // To be called after Vue has been created and after init() has completed, returns Promise
  if(!state.error) {
    state.fetching = true
    return fetchOrganization()
      .finally(() => {
        state.fetching = false
        state.fetched = true
      })
      .catch(error => {
        state.error = i18n.t('could-not-load-organization')
        console.error(state.error, error)
      })
  } else {
    return Promise.resolve()
  }
}

export function setEditMode(value) {
  state.editMode = value
  localStorage.setItem('editMode', JSON.stringify(value)) // JSON.stringify since localStorage only stores strings at the moment, and we use JSON.parse to load the value.
}
