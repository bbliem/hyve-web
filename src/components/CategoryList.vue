<template>
  <div>
    <div v-for="category in categories" :key="category.id">
      <router-link
        :to="{
          name: 'category-detail',
          params: {
            categoryId: category.id
          }
        }"
        class="category-link"
      >
        {{ category.name }}
      </router-link>
      <LessonList :category="category" />
    </div>
  </div>
</template>

<script>
import LessonList from './LessonList.vue'
import { state } from '@/store'

export default {
  name: 'CategoryList',
  components: {
    LessonList
  },
  computed: {
    categories() { return state.categories }
  }
}
</script>
