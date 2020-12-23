<template>
  <b-badge
    v-if="lessonCompleted"
    pill
    variant="success"
    :title="$t('lesson-all-sections-completed')"
  >
    &checkmark;
  </b-badge>
</template>

<script>
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
      return this.$state.user && this.$state.user.hasCompletedLesson(this.lesson)
    }
  }
}
</script>
