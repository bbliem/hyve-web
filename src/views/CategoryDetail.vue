<template>
  <div v-if="category">
    <h1>{{ category.name }}</h1>
    <p v-if="category.description">
      {{ category.description }}
    </p>
    <h2>Lessons in this category</h2>
    <div class="d-flex flex-wrap">
      <b-card
        v-for="lesson in category.lessons"
        :key="lesson.id"
        :img-src="`https://picsum.photos/seed/${lesson.id}/600/300/`"
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
          Start lesson
        </b-button>
        <LessonCompletionCheckmark
          :lesson="lesson"
          class="checkmark"
        />
      </b-card>
    </div>
  </div>
  <ErrorMessage v-else-if="fetchedMaterial" message="Category not found." />
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
  }
}
</script>

<style lang=scss>
.checkmark {
  position: absolute;
  top: 10px;
  right: 10px;
  box-shadow: 0 0 10px black;
}
</style>
