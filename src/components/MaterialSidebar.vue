<template>
  <div>
    <div v-for="category in categories" :key="category.id" class="category">
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
  name: 'MaterialSidebar',
  components: {
    LessonList
  },
  computed: {
    categories() { return state.categories }
  }
}
</script>

<style lang="scss" scoped>
.category {
  margin-bottom: 2ex;
}
</style>
