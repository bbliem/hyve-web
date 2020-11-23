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
        <div class="lesson-row">
          {{ getLessonModel(lesson).name }}
          <LessonCompletionCheckmark :lesson="lesson" class="checkmark" />
        </div>
      </router-link>
    </li>
  </ul>
</template>

<script>
import LessonCompletionCheckmark from '@/components/LessonCompletionCheckmark'
import Lesson from '@/models/Lesson'

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
  },
  methods: {
    getLessonModel(data) {
      return new Lesson(data)
    }
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
