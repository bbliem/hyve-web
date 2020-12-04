<template>
  <b-card>
    <FetchedContent :fetch="fetch" :error-message="$t('could-not-load-section')">
      <template v-slot="{}">
        <EditableText :on-save="onSaveText" :text="section.text" />
        <Quiz
          :questions="section.multipleChoiceQuestions"
          :section-id="sectionId"
          @quiz-interaction-done="onQuizInteractionDone"
        />
        <OpenQuestions
          :questions="section.openQuestions"
          :section-id="sectionId"
          @open-questions-interaction-done="onOpenQuestionsInteractionDone"
        />
      </template>
    </FetchedContent>
  </b-card>
</template>

<script>
import EditableText from '@/components/EditableText.vue'
import FetchedContent from '@/components/FetchedContent.vue'
import OpenQuestions from '@/components/OpenQuestions.vue'
import Quiz from '@/components/Quiz.vue'
import Section from '@/models/Section'

export default {
  name: 'SectionDetail',
  components: {
    EditableText,
    FetchedContent,
    OpenQuestions,
    Quiz,
  },
  props: {
    sectionId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      section: null,
      editing: false,
      quizInteractionDone: false,
      openQuestionsInteractionDone: false,
    }
  },
  computed: {
    sectionInteractionDone() {
      return this.quizInteractionDone && this.openQuestionsInteractionDone
    }
  },
  methods: {
    async fetch() {
      this.section = await Section
        .include('multiple_choice_questions.answers', 'open_questions')
        .find(this.sectionId)
    },
    onQuizInteractionDone() {
      this.quizInteractionDone = true
      if(this.sectionInteractionDone) {
        this.$emit('section-interaction-done', this.sectionId)
      }
    },
    onOpenQuestionsInteractionDone() {
      this.openQuestionsInteractionDone = true
      if(this.sectionInteractionDone) {
        this.$emit('section-interaction-done', this.sectionId)
      }
    },
    async onSaveText(text) {
      await this.section.updateFieldAndSave('text', text, ['multipleChoiceQuestions', 'openQuestions'])
    },
  },
}
</script>
