<template>
  <ul v-if="category.lessons.length" class="lesson-list">
    <li v-for="lesson in category.lessons" :key="lesson.id">
      <router-link
        :to="{
          name: 'lesson-detail',
          params: {
            categoryId: category.id,
            lessonId: lesson.id
          }}"
        class="lesson-link"
      >
        {{ lesson.name }}
      </router-link>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'LessonList',
  props: {
    category: {
      type: Object,
      required: true
    }
  }
}
</script>
