<template>
  <div>
    <ContentList v-for="category in categories" :key="category.id" :category="category" />
  </div>
</template>

<script>
import ContentList from './ContentList.vue'
import { state } from '@/store'

export default {
  name: 'CategoryList',
  components: {
    ContentList
  },
  computed: {
    categories() { return state.categories }
  }
}
</script>
