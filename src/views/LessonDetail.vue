<template>
  <div>
    <div class="text-center">
      <b-spinner v-if="loading" />
    </div>
    <div v-if="lesson">
      <h1>{{ lesson.name }}</h1>
      <p v-if="lesson.description">
        {{ lesson.description }}
      </p>
      <p>You are on page {{ page }}.</p>
      <div v-if="contentsOnCurrentPage">
        <SectionDetail v-for="content in contentsOnCurrentPage" :key="content.section" :section-id="content.section" />
      </div>
      <p>TODO: Page buttons here</p>
    </div>
    <ErrorMessage v-else-if="error" :message="error" />
  </div>
</template>

<script>
import ErrorMessage from '@/components/ErrorMessage.vue'
import SectionDetail from '@/components/SectionDetail.vue'
import Lesson from '@/models/Lesson'

export default {
  name: 'LessonDetail',
  components: {
    ErrorMessage,
    SectionDetail
  },
  props: {
    lessonId: {
      type: Number,
      required: true
    },
    page: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      lesson: null,
      error: null,
      loading: false
    }
  },
  computed: {
    contentsOnCurrentPage() {
      if(this.lesson === null) {
        return []
      }
      return this.lesson.contents.filter(({ page }) => page === this.page)
    }
  },
  created() {
    this.loading = true
    return Lesson
      .find(this.lessonId)
      .then(response => {
        this.lesson = response
      })
      .catch(error => {
        this.error = 'Could not load lesson.'
        console.error(this.error, error)
      })
      .finally(() => this.loading = false)
  }
}
</script>
