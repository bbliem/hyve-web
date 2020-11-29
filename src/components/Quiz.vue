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
            <b-badge :variant="answerCorrect(answer) ? 'success' : 'danger'">
              {{ answerCorrect(answer) ? $t('quiz.correct') : $t('quiz.incorrect') }}
            </b-badge>
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
import { state } from '@/store'

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
      return state.user.hasCompletedSection(this.sectionId)
    },
  },
  created() {
    if(!this.questions.length || this.revealSolution) {
      this.$emit('quiz-interaction-done', this.sectionId)
    }
  },
  methods: {
    answerCorrect(answer) {
      return this.selected[answer.id] === answer.correct || (this.selected[answer.id] === undefined && answer.correct === false)
    },
    onCheckAnswers() {
      state.user.completeSection(this.sectionId)
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
