<template>
  <div>
    <b-skeleton-table v-if="loading" :rows="3" :columns="1" :table-props="{ borderless: true }" />
    <b-alert v-if="error" variant="danger" show>
      {{ error }}
    </b-alert>
    <ContentList v-for="category in categories" :key="category.id" :category="category" />
  </div>
</template>

<script>
import ContentList from './ContentList.vue'
import { state, fetchCategories } from '@/store'

export default {
  name: 'CategoryList',
  components: {
    ContentList
  },
  data: function() {
    return {}
  },
  computed: {
    categories: function() {
      return state.categories
    },
    loading: function() {
      return state.loading
    },
    error: function() {
      return state.error
    }
  },
  created: function() {
    fetchCategories()
  }
}

console.log(state)
</script>
