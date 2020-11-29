<template>
  <FetchedContent :fetch="fetch" :error-message="$t('could-not-load-lesson')">
    <template v-if="lesson">
      <div class="d-flex align-items-start">
        <h1>
          <EditableText :multi-line="false" :on-save="onSaveName" :text="lesson.name" />
        </h1>
        <b-button
          v-if="someContentCompleted"
          class="ml-auto"
          variant="light"
          :title="$t('mark-lesson-sections-uncompleted')"
          @click="resetProgress"
        >
          <b-icon icon="arrow-counterclockwise" aria-hidden="true" /> {{ $t('reset-progress') }}
        </b-button>
      </div>
      <p v-if="lesson.description">
        <EditableText :on-save="onSaveDescription" :text="lesson.description" />
      </p>
      <template v-if="contents && contents.length">
        <template v-if="contentsOnCurrentPage">
          <SectionDetail v-for="content in contentsOnCurrentPage" :key="`${content.section}-${ timesProgressReset}`" :section-id="content.section" />
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
  </FetchedContent>
</template>

<script>
import EditableText from '@/components/EditableText'
import FetchedContent from '@/components/FetchedContent'
import SectionDetail from '@/components/SectionDetail'
import Lesson from '@/models/Lesson'
import { state } from '@/store'

export default {
  name: 'LessonDetail',
  components: {
    EditableText,
    FetchedContent,
    SectionDetail,
  },
  props: {
    lessonId: {
      type: Number,
      required: true,
    },
    lessons: {
      // This is an array of all lessons. This component fetches the requested lesson (given by lessonId) instead of taking it from this array because we need the lesson contents. Still, this array is used when the user updates the lesson.
      type: Array,
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
      timesProgressReset: 0, // to force re-rendering of interactive components upon progress reset
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
  methods: {
    completeSectionsOnCurrentPage() {
      for(const { section } of this.contentsOnCurrentPage) {
        this.user.completeSection(section)
      }
    },
    async fetch() {
      this.lesson = await Lesson
        .include('contents')
        .params({ omit: 'sections' })
        .find(this.lessonId)
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
    async onSaveDescription(description) {
      await this.lesson.updateFieldAndSave('description', description, ['contents'])
      this.updateLessonList()
    },
    async onSaveName(name) {
      await this.lesson.updateFieldAndSave('name', name, ['contents'])
      this.updateLessonList()
    },
    async resetProgress() {
      const response = await this.$bvModal.msgBoxConfirm(this.$t('really-reset-lesson-progress'), {
        title: this.$t('are-you-sure'),
        okTitle: this.$t('yes'),
        cancelTitle: this.$t('no'),
      })
      if(response) {
        for(const { section } of this.contents) {
          this.user.resetSectionCompletion(section)
        }
        if(this.page === 1) {
          // Force refresh of components since we're not changing the route
          this.timesProgressReset += 1
        } else {
          this.$router.push({ query: { page: 1 }})
        }
      }
    },
    updateLessonList() {
      let lesson = this.lessons.find(l => l.id === this.lessonId)
      for(const key of Object.keys(lesson)) {
        if(key in this.lesson) {
          lesson[key] = this.lesson[key]
        }
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
