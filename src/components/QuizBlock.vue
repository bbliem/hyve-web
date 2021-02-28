<template>
  <FetchedContent :fetch="fetch" :error-message="$t('could-not-load-block')">
    <template v-slot="{}">
      <div v-if="quiz.questions.length">
        <div v-for="question in quiz.questions" :key="question.id">
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
  </FetchedContent>
</template>

<script>
import EditableText from './EditableText'
import FetchedContent from '@/components/FetchedContent'
import Quiz from '@/models/Quiz'

export default {
  name: 'Quiz',
  components: {
    EditableText,
    FetchedContent,
  },
  props: {
    block: {
      type: Object,
      required: true
    },
    lessonId: {
      type: Number,
      required: true
    },
  },
  data() {
    return {
      quiz: null,
      selected: {},
    }
  },
  computed: {
    revealSolution() {
      return this.$state.user.hasCompletedBlock(this.block.id)
    },
  },
  methods: {
    async fetch() {
      this.quiz = await Quiz
        .include('questions.answers')
        .find(this.block.value)
      // Set selected checkboxes according to multiple-choice responses in User object
      for(const question of this.quiz.questions) {
        for(const answer of question.answers) {
          const existingModel = this.$state.user.multipleChoiceResponses.find(model => model.answer == answer.id)
          this.selected[answer.id] = existingModel ? existingModel.response : false
        }
      }
      if(!this.quiz.questions.length || this.revealSolution) {
        this.$emit('block-interaction-done', this.block.id)
      }
    },
    answerCorrect(answer) {
      return this.selected[answer.id] === answer.correct
    },
    answerIncorrect(answer) {
      // Responses can also be undefined, so incorrect is not the negation of correct
      return this.selected[answer.id] === !answer.correct
    },
    onCheckAnswers() {
      this.$state.user.completeBlock(this.block.id, this.lessonId)
      for(const question of this.quiz.questions) {
        for(const answer of question.answers) {
          this.$state.user.respondToMultipleChoiceQuestion(answer, this.selected[answer.id])
        }
      }
      this.$emit('block-interaction-done', this.block.id)
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
