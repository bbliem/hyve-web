import Vue from 'vue'
import Category from '@/models/Category'

export const state = Vue.observable({
  categories: [],
  error: null,
  initialized: false,
  loading: false
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
