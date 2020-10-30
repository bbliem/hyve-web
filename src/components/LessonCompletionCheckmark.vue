<template>
  <b-badge
    v-if="lessonCompleted"
    pill
    variant="success"
    title="You completed all sections in this lesson."
  >
    &checkmark;
  </b-badge>
</template>

<script>
import { state } from '@/store'

export default {
  name: 'LessonCompletionCheckmark',
  props: {
    lesson: {
      type: Object,
      required: true
    }
  },
  computed: {
    lessonCompleted() {
      const sectionsInLesson = this.lesson.contents.map(c => c.section)
      return state.user && sectionsInLesson.every(id => state.user.completedSections.includes(id))
    }
  }
}
</script>
