<template>
  <div>
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
            class="answer"
          >
            <EditableText
              :multi-line="false"
              :on-save="(newText) => onSaveAnswer(answer, newText)"
              :text="answer.text"
            />
          </b-form-checkbox>
          <p v-if="revealSolution && !answerCorrect(answer)">
            <EditableText
              :multi-line="false"
              :on-save="(newExplanation) => onSaveExplanation(answer, newExplanation)"
              :text="answer.explanation"
            />
          </p>
        </div>
      </b-form-group>
    </div>

    <p>TODO Only show "check answers" button if section not completed yet.</p>
    <b-button @click="onCheckAnswers">
      {{ $t('check-answers') }}
    </b-button>
    <p> TODO deactivate "next page" button (with tooltip) until section has been completed (i.e., answers have been checked)? (Also, we may want to mark the section as completed when "check answers" is clicked.)</p>
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
    }
  },
  data() {
    return {
      reactiveQuestions: this.questions, // If we used this.questions directly, they would not update on changes
      revealSolution: false,
      selected: {},
    }
  },
  methods: {
    answerCorrect(answer) {
      return this.selected[answer.id] === answer.correct || (this.selected[answer.id] === undefined && answer.correct === false)
    },
    onCheckAnswers() {
      this.revealSolution = true
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
