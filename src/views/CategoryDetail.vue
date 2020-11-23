<template>
  <div v-if="category">
    <h1>
      <EditableText :multi-line="false" :on-save="onSaveName" :text="category.name" />
    </h1>
    <p v-if="category.description">
      <EditableText :on-save="onSaveDescription" :text="category.description" />
    </p>
    <h2>{{ $t('lessons-in-this-category') }}</h2>
    <div class="d-flex flex-wrap">
      <b-card
        v-for="lesson in category.lessons"
        :key="lesson.id"
        :img-src="`https://picsum.photos/seed/${lesson.id}/400/200/`"
        style="max-width: 25rem"
        class="m-2"
        :title="lesson.name"
      >
        <!-- eslint-disable-next-line vue/no-v-html -->
        <b-card-text v-if="lesson.description" v-html="lesson.description" />
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
import { onUpdateCategory, state } from '@/store'
import EditableText from '@/components/EditableText.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import LessonCompletionCheckmark from '@/components/LessonCompletionCheckmark'

export default {
  name: 'CategoryDetail',
  components: {
    EditableText,
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
  methods: {
    async onSaveDescription(description) {
      await this.category.updateFieldAndSave('description', description, ['lessons'])
      onUpdateCategory(this.category)
    },
    async onSaveName(name) {
      await this.category.updateFieldAndSave('name', name, ['lessons'])
      onUpdateCategory(this.category)
    },
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
