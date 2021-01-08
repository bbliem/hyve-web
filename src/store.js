import Vue from 'vue'

import Organization from '@/models/Organization'
import User from '@/models/User'
import i18n from '@/i18n'

import { clearCredentials, restoreLogin } from '@/auth'

export const state = Vue.observable({
  organization: null,
  editMode: false,
  error: null,
  initialized: false,
  fetching: false,
  // Authentication
  // cf. https://www.digitalocean.com/community/tutorials/handling-authentication-in-vue-using-vuex
  user: null,
})

async function fetchOrganization() {
  state.fetching = true
  try {
    state.organization = await Organization
      .include('lessons')
      .find(Vue.appConfig.organization)
  } catch(error) {
    state.error = i18n.t('could-not-load-organization')
    throw error
  } finally {
    state.fetching = false
  }
}

export async function fetchUser() {
  state.fetching = true
  try {
    state.user = await User
      .include('multiple_choice_responses', 'open_question_responses', 'section_completions')
      .params({ omit: 'completed_sections' })
      .find('me')
  } catch(error) {
    resetUser()
    state.error = error
    throw error
  } finally {
    state.fetching = false
  }
}

export async function initStore() {
  await fetchOrganization()
  // Restore login if possible
  const restored = restoreLogin()
  if(restored) {
    console.log("Restored login.")
    try {
      await fetchUser()
    } catch(error) {
      clearCredentials()
    }
    state.editMode = JSON.parse(localStorage.getItem('editMode')) // JSON.parse since localStorage only stores strings at the moment
  } else {
    console.log("Login not restored.")
    resetUser()
  }
}

export function resetUser() {
  state.user = null
  state.editMode = false
  localStorage.removeItem('editMode')
}

export function setUser(user) {
  state.user = user
}

export function setEditMode(value) {
  state.editMode = value
  localStorage.setItem('editMode', JSON.stringify(value)) // JSON.stringify since localStorage only stores strings at the moment, and we use JSON.parse to load the value.
}

export default {
  install(Vue) {
    const storeInitialized = initStore().then(() => { state.initialized = true })
    Vue.state = state
    Vue.storeInitialized = storeInitialized
    Vue.prototype.$state = state
    Vue.prototype.$storeInitialized = storeInitialized
  }
}
