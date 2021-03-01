<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div v-html="block.value" />
</template>

<script>
export default {
  name: 'LessonContentBlock',
  props: {
    block: {
      type: Object,
      required: true
    },
    lesson: {
      type: Object,
      required: true
    },
  },
  created() {
    this.$emit('block-interaction-done', this.block.id)
  },
}
</script>
