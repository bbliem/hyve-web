import Vue from 'vue'
import axios from 'axios'

import User from '@/models/User'

// Owns localStorage entry 'token'

export async function changePassword(currentPassword, newPassword) {
  const data = { currentPassword, newPassword}
  await axios({ url: Vue.appConfig.backendApiUrl + '/users/set_password/', data, method: 'POST' })
}

function clearAuthorizationHeader() {
  delete axios.defaults.headers.common['Authorization']
}

export function clearCredentials() {
  localStorage.removeItem('token')
  clearAuthorizationHeader()
}

export function emailToUsername(email) {
  return `${email}:${Vue.appConfig.organization}`
}

export async function login(email, password, admin=false) {
  // return user ID
  const username = admin ? email : emailToUsername(email)
  const loginData = { username, password }
  try {
    // Get a token
    const loginResponse = await axios({ url: Vue.appConfig.backendApiUrl + '/auth/token/login/', data: loginData, method: 'POST' })
    const token = loginResponse.data.authToken
    localStorage.setItem('token', token)
    setAuthorizationHeader(token)
    // Get user data
    const userDataResponse = await axios({ url: Vue.appConfig.backendApiUrl + '/users/me/' })
    return new User(userDataResponse.data)
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
  await axios({ url: Vue.appConfig.backendApiUrl + '/users/', data, method: 'POST' })
}

export async function requestPasswordReset(email) {
  const organization = Vue.appConfig.organization
  const data = { email, organization }
  await axios({ url: Vue.appConfig.backendApiUrl + '/users/reset_password/', data, method: 'POST' })
}

export async function resetPassword(uid, token, password) {
  const data = { uid, token, new_password: password }
  await axios({ url: Vue.appConfig.backendApiUrl + '/users/reset_password_confirm/', data, method: 'POST' })
}

export function restoreLogin() {
  // return true (and set auth header) if login was restored, else return null
  const token = localStorage.getItem('token')
  if(token) {
    setAuthorizationHeader(token)
    return true
  }
  return false
}

function setAuthorizationHeader(token) {
  axios.defaults.headers.common['Authorization'] = 'Token ' + token
}
