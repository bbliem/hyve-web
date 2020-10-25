<template>
  <div v-if="category">
    <h1>{{ category.name }}</h1>
    <h2>Lessons in this category</h2>
    <ul>
      <li v-for="lesson in category.lessons" :key="lesson.id">
        <router-link
          :to="{
            name: 'lesson-detail',
            params: {
              categoryId: category.id,
              lessonId: lesson.id
            }}"
        >
          {{ lesson.name }}
        </router-link>
      </li>
    </ul>
  </div>
  <ErrorMessage v-else-if="storeInitialized" message="Category not found." />
</template>

<script>
import { state } from '@/store'
import ErrorMessage from '../components/ErrorMessage.vue'

export default {
  name: 'CategoryDetail',
  components: {
    ErrorMessage
  },
  props: {
    categoryId: {
      type: Number,
      required: true
    }
  },
  computed: {
    category() {
      return state.categories.find(c => c.id === this.categoryId)
    },
    storeInitialized() {
      return state.initialized
    }
  }
}
</script>
