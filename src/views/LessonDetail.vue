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
      <div v-if="contentsOnCurrentPage">
        <SectionDetail v-for="content in contentsOnCurrentPage" :key="content.section" :section-id="content.section" />
      </div>
      <!-- Page navigation -->
      <b-row class="m-3">
        <b-col>
          <b-button
            v-if="page > 1"
            size="lg"
            class="float-left"
            @click="onPrevious"
          >
            Previous page
          </b-button>
        </b-col>
        <b-col class="text-center">
          Page {{ page }} of {{ numPages }}
        </b-col>
        <b-col>
          <b-button
            v-if="page < numPages"
            size="lg"
            class="float-right"
            @click="onNext"
          >
            Next page
          </b-button>
          <b-button
            v-else-if="page === numPages"
            variant="primary"
            size="lg"
            class="float-right"
            @click="onFinish"
          >
            Finish lesson
          </b-button>
        </b-col>
      </b-row>
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
    contents() {
      return this.lesson === null ? [] : this.lesson.contents
    },
    contentsOnCurrentPage() {
      return this.contents.filter(({ page }) => page === this.page)
    },
    numPages() {
      const pageNumbers = this.contents.map(({ page }) => page)
      return pageNumbers.length ? Math.max(...pageNumbers) : 0
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
  },
  methods: {
    onPrevious() {
      this.$router.push({ query: { page: this.page - 1 } })
    },
    onNext() {
      this.$router.push({ query: { page: this.page + 1 } })
    },
    onFinish() {
      alert('Finished')
    }
  },
}
</script>
