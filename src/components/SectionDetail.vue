<template>
  <b-card>
    <div class="text-center">
      <b-spinner v-if="loading" />
    </div>
    <div v-if="section">
      <p v-if="section.text">
        {{ section.text }}
      </p>
      <p v-if="section.text">
        TODO render quiz
      </p>
    </div>
    <ErrorMessage v-else-if="error" :message="error" />
  </b-card>
</template>

<script>
import ErrorMessage from '@/components/ErrorMessage.vue'
import Section from '@/models/Section'

export default {
  name: 'SectionDetail',
  components: {
    ErrorMessage
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
