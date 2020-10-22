<template>
  <div>
    <section v-if="category">
      <h1>{{ category.name }}</h1>
      <p>{{ category.description }}</p>
      <h2>Lessons in this category</h2>
      <ul>
        <li v-for="lesson in category.lessons" :key="lesson.id">
          <router-link :to="'/' + categoryId + '/' + lesson.id">
            {{ lesson.name }}
          </router-link>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import { state } from '@/store'

export default {
  name: 'CategoryDetail',
  props: {
    categoryId: {
      type: Number,
      required: true
    }
  },
  computed: {
    category() {
      return state.categories.find(c => c.id == this.categoryId)
    }
  }
}
</script>
