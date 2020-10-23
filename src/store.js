import Vue from 'vue'
import Category from '@/models/Category'

export const state = Vue.observable({
  categories: [],
  error: null,
  loading: false
})

export function fetchCategories() {
  state.loading = true
  return Category
    .include('lessons')
    .params({omit: 'lessons.contents'})
    .get()
    .then(response => {
      state.categories = response
    })
    .catch(error => {
      state.error = 'Could not load categories.'
      console.error(state.error, error)
    })
    .finally(() => state.loading = false)
}
