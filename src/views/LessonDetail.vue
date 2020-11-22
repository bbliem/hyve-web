<template>
  <div>
    <div class="text-center">
      <b-spinner v-if="loading" />
    </div>
    <template v-if="lesson">
      <div style="display: flex">
        <h1 style="flex-grow: 1">
          {{ lesson.name }}
        </h1>
        <b-button
          v-if="someContentCompleted"
          variant="light"
          :title="$t('mark-lesson-sections-uncompleted')"
          @click="resetProgress"
        >
          <b-icon icon="arrow-counterclockwise" aria-hidden="true" /> {{ $t('reset-progress') }}
        </b-button>
      </div>
      <p v-if="lesson.description">
        {{ lesson.description }}
      </p>
      <template v-if="contents && contents.length">
        <template v-if="contentsOnCurrentPage">
          <SectionDetail v-for="content in contentsOnCurrentPage" :key="content.section" :section-id="content.section" />
        </template>
        <!-- Page navigation -->
        <b-row class="m-3">
          <b-col>
            <b-button
              v-if="page > 1"
              size="lg"
              class="float-left"
              @click="onPrevious"
            >
              {{ $t('previous-page') }}
            </b-button>
          </b-col>
          <b-col class="text-center">
            {{ $t('page-i-of-n', { i: page, n: numPages }) }}
          </b-col>
          <b-col>
            <b-button
              v-if="page < numPages"
              size="lg"
              class="float-right"
              @click="onNext"
            >
              {{ $t('next-page') }}
            </b-button>
            <b-button
              v-else-if="page === numPages"
              variant="primary"
              size="lg"
              class="float-right"
              @click="onFinish"
            >
              {{ $t('finish-lesson') }}
            </b-button>
          </b-col>
        </b-row>
      </template>
      <p v-else>
        {{ $t('lesson-has-no-content') }}
      </p>
    </template>
    <ErrorMessage v-else-if="error" :message="error" />
  </div>
</template>

<script>
import ErrorMessage from '@/components/ErrorMessage.vue'
import SectionDetail from '@/components/SectionDetail.vue'
import Lesson from '@/models/Lesson'
import { state } from '@/store'

export default {
  name: 'LessonDetail',
  components: {
    ErrorMessage,
    SectionDetail,
  },
  props: {
    lessonId: {
      type: Number,
      required: true,
    },
    page: {
      type: Number,
      default: 1,
    }
  },
  data() {
    return {
      lesson: null,
      error: null,
      loading: false,
    }
  },
  computed: {
    someContentCompleted() {
      return state.user && this.contents.some(({section}) => state.user.hasCompletedSection(section))
    },
    contents() {
      return this.lesson === null ? [] : this.lesson.contents
    },
    contentsOnCurrentPage() {
      return this.contents.filter(({ page }) => page === this.page)
    },
    numPages() {
      const pageNumbers = this.contents.map(({ page }) => page)
      return pageNumbers.length ? Math.max(...pageNumbers) : 0
    },
    user() {
      return state.user
    },
  },
  created() {
    this.loading = true
    return Lesson
      .find(this.lessonId)
      .then(response => {
        this.lesson = response
      })
      .catch(error => {
        this.error = this.$t('could-not-load-lesson')
        console.error(this.error, error)
      })
      .finally(() => this.loading = false)
  },
  methods: {
    completeSectionsOnCurrentPage() {
      for(const { section } of this.contentsOnCurrentPage) {
        this.user.completeSection(section)
      }
    },
    onPrevious() {
      this.$router.push({ query: { page: this.page - 1 } })
    },
    onNext() {
      this.completeSectionsOnCurrentPage()
      this.$router.push({ query: { page: this.page + 1 } })
    },
    onFinish() {
      this.completeSectionsOnCurrentPage()
      this.$router.push({ name: 'material-home' })
    },
    resetProgress() {
      for(const { section } of this.contents) {
        this.user.resetSectionCompletion(section)
      }
    },
  },
  metaInfo() {
    return {
      title: this.lesson ? this.lesson.name : undefined
    }
  },
}
</script>
