import Vue from 'vue'
import axios from 'axios'

// Owns localStorage entries 'userId' and 'token'

function clearAuthorizationHeader() {
  delete axios.defaults.headers.common['Authorization']
}

export function clearCredentials() {
  localStorage.removeItem('userId')
  localStorage.removeItem('token')
  clearAuthorizationHeader()
}

function emailToUsername(email) {
  return `${email}:${Vue.appConfig.organization}`
}

export async function login(email, password) {
  // return user ID
  const username = emailToUsername(email)
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
    return userId
  } catch(error) {
    clearCredentials()
    throw error
  }
}

export async function logout() {
  await axios({ url: Vue.appConfig.backendApiUrl + '/auth/token/logout', method: 'POST' })
  clearCredentials();
}

export async function register(email, password) {
  const username = emailToUsername(email)
  const organization = Vue.appConfig.organization
  const data = { email, organization, username, password }
  await axios({ url: Vue.appConfig.backendApiUrl + '/auth/users/', data, method: 'POST' })
}

export function restoreLogin() {
  // return userId (and set auth header) or null
  const userId = localStorage.getItem('userId')
  const token = localStorage.getItem('token')
  if(token && userId) {
    setAuthorizationHeader(token)
    return userId
  }
  return null
}

function setAuthorizationHeader(token) {
  axios.defaults.headers.common['Authorization'] = 'Token ' + token
}
