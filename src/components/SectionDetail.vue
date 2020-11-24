<template>
  <b-card>
    <div class="text-center">
      <b-spinner v-if="loading" />
    </div>
    <div v-if="section">
      <EditableText :on-save="onSaveText" :text="section.text" />

      <!-- Quiz -->
      <p v-if="section.questions.length">
        <Quiz :questions="section.questions" :section-id="sectionId" />
      </p>
    </div>

    <ErrorMessage v-else-if="error" :message="error" />
  </b-card>
</template>

<script>
import ErrorMessage from '@/components/ErrorMessage.vue'
import EditableText from '@/components/EditableText.vue'
import Quiz from '@/components/Quiz.vue'
import Section from '@/models/Section'

export default {
  name: 'SectionDetail',
  components: {
    EditableText,
    ErrorMessage,
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
      error: null,
      loading: false,
      editing: false,
    }
  },
  created() {
    this.loading = true
    return Section
      .include('questions.answers')
      .find(this.sectionId)
      .then(response => {
        this.section = response
      })
      .catch(error => {
        this.error = this.$t('could-not-load-section')
        console.error(this.error, error)
      })
      .finally(() => this.loading = false)
  },
  methods: {
    async onSaveText(text) {
      await this.section.updateFieldAndSave('text', text, ['questions'])
    },
  },
}
</script>
