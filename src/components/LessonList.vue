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
        <LessonCompletionCheckmark :lesson="lesson" style="float: right" />
      </router-link>
    </li>
  </ul>
</template>

<script>
import LessonCompletionCheckmark from '@/components/LessonCompletionCheckmark'

export default {
  name: 'LessonList',
  components: {
    LessonCompletionCheckmark
  },
  props: {
    category: {
      type: Object,
      required: true
    }
  }
}
</script>
