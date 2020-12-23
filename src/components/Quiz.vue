<template>
  <div v-if="reactiveQuestions.length">
    <div v-for="question in reactiveQuestions" :key="question.id">
      <b-form-group>
        <template v-slot:label>
          <EditableText
            :multi-line="false"
            :on-save="(newText) => onSaveQuestion(question, newText)"
            :text="question.text"
          />
        </template>
        <div v-for="answer in question.answers" :key="answer.id">
          <b-form-checkbox
            v-model="selected[answer.id]"
            :disabled="revealSolution"
            class="answer"
          >
            <EditableText
              :multi-line="false"
              :on-save="(newText) => onSaveAnswer(answer, newText)"
              :text="answer.text"
            />
          </b-form-checkbox>
          <div v-if="revealSolution">
            <template v-if="answerCorrect(answer)">
              <b-badge variant="success">
                {{ $t('quiz.correct') }}
              </b-badge>
            </template>
            <template v-else-if="answerIncorrect(answer)">
              <b-badge variant="danger">
                {{ $t('quiz.incorrect') }}
              </b-badge>
            </template>
            <EditableText
              :multi-line="false"
              :on-save="(newExplanation) => onSaveExplanation(answer, newExplanation)"
              :text="answer.explanation"
            />
          </div>
        </div>
      </b-form-group>
    </div>

    <b-button :disabled="revealSolution" @click="onCheckAnswers">
      {{ $t('check-answers') }}
    </b-button>
  </div>
</template>

<script>
import EditableText from './EditableText'

export default {
  name: 'Quiz',
  components: {
    EditableText,
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
      selected: {},
    }
  },
  computed: {
    revealSolution() {
      return this.$state.user.hasCompletedSection(this.sectionId)
    },
  },
  created() {
    // Set selected checkboxes according to multiple-choice responses in User object
    for(const question of this.questions) {
      for(const answer of question.answers) {
        const existingModel = this.$state.user.multipleChoiceResponses.find(model => model.answer == answer.id)
        this.selected[answer.id] = existingModel ? existingModel.response : false
      }
    }
    if(!this.questions.length || this.revealSolution) {
      this.$emit('quiz-interaction-done', this.sectionId)
    }
  },
  methods: {
    answerCorrect(answer) {
      return this.selected[answer.id] === answer.correct
    },
    answerIncorrect(answer) {
      // Responses can also be undefined, so incorrect is not the negation of correct
      return this.selected[answer.id] === !answer.correct
    },
    onCheckAnswers() {
      this.$state.user.completeSection(this.sectionId)
      for(const question of this.questions) {
        for(const answer of question.answers) {
          this.$state.user.respondToMultipleChoiceQuestion(answer, this.selected[answer.id])
        }
      }
      this.$emit('quiz-interaction-done', this.sectionId)
    },
    async onSaveAnswer(answer, newText) {
      await answer.updateFieldAndSave('text', newText)
    },
    async onSaveExplanation(answer, newExplanation) {
      await answer.updateFieldAndSave('explanation', newExplanation)
    },
    async onSaveQuestion(question, newText) {
      await question.updateFieldAndSave('text', newText, ['answers'])
      // Note that due to the top-down flow of information, the questions that have been passed as props will not be pdated. If we need this, we could, e.g., emit an event.
    },
  }
}
</script>
