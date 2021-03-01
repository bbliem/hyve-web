<template>
  <b-embed
    type="video"
    controls
    :poster="videoData.thumbnail"
    preload="metadata"
    :src="videoUrl"
  />
</template>

<script>
export default {
  name: 'VideoBlock',
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
  computed: {
    videoData() {
      return this.lesson.videos[this.block.value]
    },
    videoUrl() {
      return `${this.$appConfig.mediaUrl}/${this.videoData.file}`
    }
  },
  created() {
    this.$emit('block-interaction-done', this.block.id)
  },
}
</script>
