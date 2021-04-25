<template>
  <div>
    <b-embed
      v-if="block.value.type === 'video'"
      type="video"
      controls
      :poster="block.value.thumbnail"
      preload="metadata"
      :src="block.value.file"
    />
    <audio
      v-if="block.value.type === 'audio'"
      controls
      preload="metadata"
      style="width: 100%; max-width: 600px"
    >
      <!-- FIXME: Add "type" attribute -->
      <source
        :src="block.value.file"
      >
    </audio>
  </div>
</template>

<script>
export default {
  name: 'MediaBlock',
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
