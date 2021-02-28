<template>
  <FetchedContent :fetch="fetch" :error-message="$t('could-not-load-lesson')">
    <template v-if="lesson">
      <div class="d-flex align-items-start">
        <h1>
          <EditableText :multi-line="false" :on-save="onSaveTitle" :text="lesson.title" />
        </h1>
        <b-button
          v-if="canResetProgress"
          class="ml-auto"
          variant="light"
          :title="$t('mark-lesson-uncompleted')"
          @click="resetProgress"
        >
          <b-icon icon="arrow-counterclockwise" aria-hidden="true" /> {{ $t('reset-progress') }}
        </b-button>
      </div>
      <p v-if="lesson.description">
        <EditableText :on-save="onSaveDescription" :text="lesson.description" />
      </p>
      <template v-if="blocks && blocks.length">
        <template v-if="blocksOnCurrentPage">
          <StreamFieldBlock
            v-for="block in blocksOnCurrentPage"
            :key="`${block.id}-${timesProgressReset}`"
            :block="block"
            :lesson-id="lesson.id"
            @block-interaction-done="onBlockInteractionDone($event)"
          />
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
              :disabled="nextDisabled"
              @click="onNext"
            >
              {{ $t('next-page') }}
            </b-button>
            <b-button
              v-else-if="page === numPages"
              variant="primary"
              size="lg"
              class="float-right"
              :disabled="nextDisabled"
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
import StreamFieldBlock from '@/components/StreamFieldBlock'
import Lesson from '@/models/Lesson'

export default {
  name: 'LessonDetail',
  components: {
    EditableText,
    FetchedContent,
    StreamFieldBlock,
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
      blockingBlocks: {}, // Map StreamField block UUID to Boolean; for reactivity issues see https://vuejs.org/v2/guide/reactivity.html#For-Objects
      lesson: null,
      timesProgressReset: 0, // to force re-rendering of interactive components upon progress reset
      blockPages: [], // Array of arrays of blocks; page break blocks are included in the page they end
    }
  },
  computed: {
    numBlockingBlocksOnCurrentPage() {
      return Object.keys(this.blockingBlocks).filter(blockId => {
        if(this.blockingBlocks[blockId]) {
          return this.pageOfBlock(blockId) === this.page
        }
        return false
      }).length
    },
    canResetProgress() {
      return this.$state.user && this.blocks.some(({id}) => this.$state.user.hasCompletedBlock(id))
    },
    blocks() {
      return this.lesson.blocks
    },
    blocksOnCurrentPage() {
      return this.blockPages[this.page - 1]
    },
    nextDisabled() {
      // Disable the next/finish button until we have heard from all blocks on the page that they are done
      return this.numBlockingBlocksOnCurrentPage > 0
    },
    numPages() {
      return this.blockPages.length
    },
    user() {
      return this.$state.user
    },
  },
  methods: {
    async fetch() {
      this.lesson = await Lesson
        .params({ omit: 'block_ids_en,block_ids_fi' })  // FIXME: Needs to be kept in sync with the locales, which is terrible
        .find(this.lessonId)
      this.setAllBlocksBlocking()
      // Build block pages
      this.blockPages = [[]]
      let page_index = 0
      for(const block of this.lesson.blocks) {
        this.blockPages[page_index].push(block)
        if(block.type === 'page_break') {
          ++page_index
          this.blockPages.push([])
        }
      }
    },
    completeBlocksOnCurrentPage() {
      for(const { id } of this.blocksOnCurrentPage) {
        this.user.completeBlock(id, this.lesson.id)
      }
    },
    pageOfBlock(blockId) {
      return this.blockPages.findIndex(blocks => blocks.some(({ id }) => id === blockId)) + 1
    },
    onPrevious() {
      this.$router.push({ query: { page: this.page - 1 } })
    },
    onNext() {
      this.completeBlocksOnCurrentPage()
      this.$router.push({ query: { page: this.page + 1 } })
    },
    onFinish() {
      this.completeBlocksOnCurrentPage()
      this.$router.push({ name: 'material-home' })
    },
    async onSaveDescription(description) {
      await this.lesson.updateFieldAndSave('description', description)
      this.updateLessonList()
    },
    async onSaveTitle(title) {
      await this.lesson.updateFieldAndSave('title', title)
      this.updateLessonList()
    },
    onBlockInteractionDone(blockId) {
      this.$set(this.blockingBlocks, blockId, false)
    },
    async resetProgress() {
      const response = await this.$bvModal.msgBoxConfirm(this.$t('really-reset-lesson-progress'), {
        title: this.$t('are-you-sure'),
        okTitle: this.$t('yes'),
        cancelTitle: this.$t('no'),
      })
      if(response) {
        for(const { id } of this.blocks) {
          this.user.resetBlockCompletion(id)
        }
        this.setAllBlocksBlocking()
        if(this.page === 1) {
          // Force refresh of components since we're not changing the route
          this.timesProgressReset += 1
        } else {
          this.$router.push({ query: { page: 1 }})
        }
      }
    },
    setAllBlocksBlocking() {
      for(const block of this.lesson.blocks) {
        this.$set(this.blockingBlocks, block.id, true)
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
      title: this.lesson ? this.lesson.title : undefined
    }
  },
}
</script>
