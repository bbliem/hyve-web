<template>
  <b-card>
    <div class="text-center">
      <b-spinner v-if="loading" />
    </div>
    <div v-if="section">
      <div v-if="section.text">
        <div>{{ section.text }}</div>
        <Editor />
      </div>
      <p v-if="section.questions.length">
        <Quiz :questions="section.questions" />
      </p>
    </div>
    <ErrorMessage v-else-if="error" :message="error" />
  </b-card>
</template>

<script>
import Editor from '@/components/Editor.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import Quiz from '@/components/Quiz.vue'
import Section from '@/models/Section'

export default {
  name: 'SectionDetail',
  components: {
    Editor,
    ErrorMessage,
    Quiz
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
      loading: false
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
        this.error = 'Could not load section.'
        console.error(this.error, error)
      })
      .finally(() => this.loading = false)
  }
}
</script>

<style lang="scss">
.collapsed > .when-open,
.not-collapsed > .when-closed {
  display: none;
}
</style>
