<template>
  <ul v-if="lessons.length" class="lesson-list">
    <li v-for="lesson in lessons" :key="lesson.id">
      <router-link
        :to="{
          name: 'lesson-detail',
          params: {
            categoryId: category.id,
            lessonId: lesson.id
          }}"
      >
        <div class="lesson-row">
          {{ lesson.name }}
          <LessonCompletionCheckmark :lesson="lesson" class="checkmark" />
        </div>
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
    },
    lessons: {
      type: Array,
      required: true
    },
  },
}
</script>

<style lang="scss" scoped>
.lesson-row {
  display: flex;
  align-items: flex-start;
}

.checkmark {
  margin-left: auto;
}
</style>
