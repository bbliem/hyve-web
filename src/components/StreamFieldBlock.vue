<template>
  <!-- blockValue can be undefined, e.g., for page_break blocks -->
  <b-card v-if="blockComponent">
    <component
      :is="blockComponent"
      :block="block"
      :lesson="lesson"
      @block-interaction-done="onBlockInteractionDone"
    />
  </b-card>
</template>

<script>
import LessonContentBlock from '@/components/LessonContentBlock'
import MediaBlock from '@/components/MediaBlock'
import OpenQuestionBlock from '@/components/OpenQuestionBlock'
import QuizBlock from '@/components/QuizBlock'

export default {
  name: 'StreamFieldBlock',
  components: {
    LessonContentBlock,
    MediaBlock,
    OpenQuestionBlock,
    QuizBlock,
  },
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
  data() {
    return {
      blockComponent: null,
    }
  },
  created() {
    switch(this.block.type) {
      case 'lesson_content':
        this.blockComponent = 'LessonContentBlock'
        break;

      case 'open_question':
        this.blockComponent = 'OpenQuestionBlock'
        break;

      case 'quiz':
        this.blockComponent = 'QuizBlock'
        break;

      case 'media':
        this.blockComponent = 'MediaBlock'
        break;

      case 'page_break':
        this.onBlockInteractionDone()
        break;
    }
  },
  methods: {
    onBlockInteractionDone() {
      this.$emit('block-interaction-done', this.block.id)
    },
  },
}
</script>
