<template>
  <div>
    <div v-for="question in questions" :key="question.id">
      <b-form-group>
        <template v-slot:label>
          <EditableText
            :multi-line="false"
            :on-save="() => onSaveQuestion(question)"
            :text="question.text"
          />
        </template>
        <div v-for="answer in question.answerModels" :key="answer.id">
          <b-form-checkbox
            v-model="selected[answer.id]"
            class="answer"
          >
            <EditableText
              :multi-line="false"
              :on-save="() => onSaveAnswer(answer)"
              :text="answer.text"
            />
          </b-form-checkbox>
          <p v-if="revealSolution && !answerCorrect(answer)">
            <EditableText
              :multi-line="false"
              :on-save="() => onSaveExplanation(answer)"
              :text="'TODO explain why this is wrong'"
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
      selected: new Object(),
      revealSolution: false
    }
  },
  methods: {
    answerCorrect(answer) {
      return this.selected[answer.id] === answer.correct || (this.selected[answer.id] === undefined && answer.correct === false)
    },
    onCheckAnswers() {
      this.revealSolution = true
    },
    onSaveAnswer(answer) {
      console.log("save answer", answer)
    },
    onSaveExplanation(answer) {
      console.log("save explanation for answer", answer)
    },
    onSaveQuestion(question) {
      console.log("save question", question)
    },
  }
}
</script>
