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
  state.editMode = false
  localStorage.removeItem('editMode')
}

async function fetchOrganization() {
  state.organization = await Organization
    .include('lessons')
    .find(Vue.appConfig.organization)
}

async function fetchUserData(userId) {
  state.user = await User
    .include('multiple_choice_responses', 'open_question_responses', 'section_completions')
    .params({ omit: 'completed_sections' })
    .find(userId)
}

async function restoreLogin() {
  // Restore user data and token from the last visit
  const userId = localStorage.getItem('userId')
  const token = localStorage.getItem('token')
  if(token && userId) {
    setAuthorizationHeader(token)
    // Get user data
    try {
      await fetchUserData(userId)
    } catch(error) {
      clearCredentials()
      throw error
    }
    return state.user
  } else {
    clearCredentials()
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

export async function login(email, password) {
  const username = `${email}:${Vue.appConfig.organization}`
  const loginData = { username, password }
  try {
    // Get a token
    const loginResponse = await axios({ url: Vue.appConfig.backendApiUrl + '/auth/token/login/', data: loginData, method: 'POST' })
    const token = loginResponse.data.authToken
    localStorage.setItem('token', token)
    setAuthorizationHeader(token)
    // Get user id
    const userDataResponse = await axios({ url: Vue.appConfig.backendApiUrl + '/auth/users/me/' })
    const userId = userDataResponse.data.id
    localStorage.setItem('userId', userId)
    // Get user details
    await fetchUserData(userId)
    return state.user
  } catch(error) {
    clearCredentials()
    throw error
  }
}

export async function logout() {
  await axios({ url: Vue.appConfig.backendApiUrl + '/auth/token/logout', method: 'POST' })
  clearCredentials();
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
