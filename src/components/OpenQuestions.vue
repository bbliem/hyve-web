<template>
  <div v-if="reactiveQuestions.length">
    <div v-for="question in reactiveQuestions" :key="question.id">
      <EditableText
        :multi-line="false"
        :on-save="(newText) => onSaveQuestion(question, newText)"
        :text="question.text"
      />

      <Editor
        :content="responses[question.id]"
        :multi-line="true"
        :on-save="(response) => onSubmitResponse(question, response)"
        :show-close-button="false"
      />
    </div>
  </div>
</template>

<script>
import EditableText from './EditableText'
import Editor from './Editor'

export default {
  name: 'OpenQuestions',
  components: {
    EditableText,
    Editor,
  },
  props: {
    questions: {
      type: Array,
      required: true
    },
    sectionId: {
      type: Number,
      required: true
    },
  },
  data() {
    return {
      reactiveQuestions: this.questions, // If we used this.questions directly, they would not update on changes
      responses: {},
    }
  },
  created() {
    for(const question of this.questions) {
      const existingModel = this.$state.user.openQuestionResponses.find(model => model.question == question.id)
      this.responses[question.id] = existingModel ? existingModel.response : ''
    }

    // TBD Should we require the user to respond to each question before we send the signal?
    this.$emit('open-questions-interaction-done', this.sectionId)
  },
  methods: {
    async onSubmitResponse(question, response) {
      await this.$state.user.respondToOpenQuestion(question, response)
    },
    async onSaveQuestion(question, newText) {
      await question.updateFieldAndSave('text', newText)
      // Note that due to the top-down flow of information, the questions that have been passed as props will not be pdated. If we need this, we could, e.g., emit an event.
    },
  }
}
</script>
