<template>
  <b-card>
    <div class="text-center">
      <b-spinner v-if="loading" />
    </div>
    <div v-if="section">
      <div v-if="section.text">
        <!-- Editor for text part -->
        <template v-if="editing">
          <Editor :content="section.text" :on-save="onSaveText" @close-editor="closeEditor" />
        </template>

        <!-- Text part -->
        <template v-else>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="section.text" />
          <b-button v-if="canEdit" @click="openEditor">
            <b-icon icon="pencil" aria-hidden="true" /> {{ $t('edit') }}
          </b-button>
        </template>
      </div>

      <!-- Quiz -->
      <p v-if="section.questions.length">
        <Quiz :questions="section.questions" />
      </p>
    </div>

    <ErrorMessage v-else-if="error" :message="error" />
  </b-card>
</template>

<script>
import { state } from '@/store'
import Editor from '@/components/Editor.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import Quiz from '@/components/Quiz.vue'
import Section from '@/models/Section'

export default {
  name: 'SectionDetail',
  components: {
    Editor,
    ErrorMessage,
    Quiz,
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
      loading: false,
      editing: false,
    }
  },
  computed: {
    canEdit() {
      return state.user && state.user.isSuperuser
    },
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
        this.error = this.$t('could-not-load-section')
        console.error(this.error, error)
      })
      .finally(() => this.loading = false)
  },
  methods: {
    openEditor() {
      this.editing = true
    },
    closeEditor() {
      this.editing = false
    },
    async onSaveText(text) {
      const oldText = this.section.text
      this.section.text = text
      try {
        await this.section.save()
      } catch(error) {
        this.section.text = oldText
        throw error
      }
    },
  },
}
</script>

<style lang="scss">
.collapsed > .when-open,
.not-collapsed > .when-closed {
  display: none;
}
</style>
