<template>
  <FetchedContent :fetch="fetch" :error-message="$t('could-not-load-block')">
    <template v-slot="{}">
      <EditableText
        :multi-line="false"
        :on-save="(newText) => onSaveQuestion(newText)"
        :text="openQuestion.text"
      />

      <Editor
        :content="response"
        :multi-line="true"
        :on-save="(response) => onSubmitResponse(response)"
        :show-close-button="false"
      />
    </template>
  </FetchedContent>
</template>

<script>
import EditableText from './EditableText'
import Editor from './Editor'
import FetchedContent from '@/components/FetchedContent'
import OpenQuestion from '@/models/OpenQuestion'

export default {
  name: 'OpenQuestion',
  components: {
    EditableText,
    Editor,
    FetchedContent,
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
      openQuestion: null,
      response: null,
    }
  },
  methods: {
    async fetch() {
      this.openQuestion = await OpenQuestion
        .find(this.block.value)

      const existingModel = this.$state.user.openQuestionResponses.find(model => model.question == this.block.value)
      this.response = existingModel ? existingModel.response : ''

      // TBD: Should we require the user to respond to the question before we send the signal?
      this.$emit('block-interaction-done', this.block.id)
    },
    async onSubmitResponse(response) {
      await this.$state.user.respondToOpenQuestion(this.openQuestion, response)
    },
    async onSaveQuestion(newText) {
      await this.openQuestion.updateFieldAndSave('text', newText)
    },
  }
}
</script>
