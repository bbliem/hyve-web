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
        class="sidebar-headline"
      >
        {{ category.title }}
      </router-link>
      <LessonList
        v-if="activeCategoryId === category.id"
        :category="category"
        :lessons="lessonsInCategory(category)"
      />
    </div>
  </div>
</template>

<script>
import LessonList from './LessonList.vue'

export default {
  name: 'MaterialSidebar',
  components: {
    LessonList
  },
  props: {
    activeCategoryId: {
      type: Number,
      default: undefined,
    },
    categories: {
      type: Array,
      required: true,
    },
    lessons: {
      type: Array,
      required: true,
    },
  },
  methods: {
    lessonsInCategory(category) {
      return this.lessons.filter(l => category.lessons.includes(l.id))
    },
  },
}
</script>

<style lang="scss" scoped>
.category {
  margin-bottom: 2ex;
}
</style>
