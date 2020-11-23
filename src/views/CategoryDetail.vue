<template>
  <div v-if="category">
    <h1>{{ category.name }}</h1>
    <p v-if="category.description">
      {{ category.description }}
    </p>
    <h2>{{ $t('lessons-in-this-category') }}</h2>
    <div class="d-flex flex-wrap">
      <b-card
        v-for="lesson in category.lessonModels"
        :key="lesson.id"
        :img-src="`https://picsum.photos/seed/${lesson.id}/400/200/`"
        style="max-width: 25rem"
        class="m-2"
        :title="lesson.name"
      >
        <b-card-text v-if="lesson.description">
          {{ lesson.description }}
        </b-card-text>
        <b-button
          :to="{
            name: 'lesson-detail',
            params: {
              categoryId: category.id,
              lessonId: lesson.id
            }}"
        >
          {{ $t('start-lesson') }}
        </b-button>
        <LessonCompletionCheckmark
          :lesson="lesson"
          class="checkmark"
        />
      </b-card>
    </div>
  </div>
  <ErrorMessage v-else-if="fetchedMaterial" :message="$t('category-not-found')" />
</template>

<script>
import { state } from '@/store'
import ErrorMessage from '@/components/ErrorMessage.vue'
import LessonCompletionCheckmark from '@/components/LessonCompletionCheckmark'

export default {
  name: 'CategoryDetail',
  components: {
    ErrorMessage,
    LessonCompletionCheckmark
  },
  props: {
    categoryId: {
      type: Number,
      required: true
    }
  },
  computed: {
    category() {
      return state.categories.find(c => c.id === this.categoryId)
    },
    fetchedMaterial() {
      return state.fetchedMaterial
    }
  },
  metaInfo() {
    return {
      title: this.category ? this.category.name : undefined
    }
  },
}
</script>

<style lang="scss" scoped>
.checkmark {
  position: absolute;
  top: 10px;
  right: 10px;
  box-shadow: 0 0 10px black;
}
</style>
