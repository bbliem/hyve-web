<template>
  <div>
    <div v-for="question in questions" :key="question.id">
      <b-form-group :label="question.text">
        <div v-for="answer in question.answers" :key="answer.id">
          <b-form-checkbox
            v-model="answer.selected"
            class="answer"
          >
            {{ answer.text }}
          </b-form-checkbox>
          <p v-if="revealSolution && !answerCorrect(answer)">
            TODO explanation why this answer is wrong
          </p>
        </div>
      </b-form-group>
    </div>

    <b-button
      class="#TODO:float-right"
      @click="onCheckAnswers"
    >
      Check answers
    </b-button>
    <p> TODO deactivate "next page" button (with tooltip) until section has been completed (i.e., answers have been checked)? (Also, we may want to mark the section as completed when "check answers" is clicked.)</p>
  </div>
</template>

<script>
export default {
  name: 'Quiz',
  props: {
    questions: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selected: [],
      revealSolution: false
    }
  },
  methods: {
    answerCorrect(answer) {
      return answer.selected === answer.correct || (answer.selected === undefined && answer.correct === false)
    },
    onCheckAnswers() {
      this.revealSolution = true
    }
  }
}
</script>

<style lang="scss">
.answer {
  width: 100%;
  font-weight: bold;
  font-color: red;
}
</style>
