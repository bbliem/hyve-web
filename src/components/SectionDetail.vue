<template>
  <b-card>
    <div class="text-center">
      <b-spinner v-if="loading" />
    </div>
    <div v-if="section">
      <div v-if="section.text">
        <!-- Editor for text part -->
        <template v-if="editing">
          <Editor :content="section.text" @became-dirty="onEditorBecameDirty" @became-clean="onEditorBecameClean" />

          <b-button v-if="saving" disabled variant="primary">
            <b-spinner small /> Saving...
          </b-button>
          <b-button
            v-else
            variant="primary"
            :disabled="!unsavedEdits"
            class="mr-1"
            @click="onSave"
          >
            <b-icon icon="check" aria-hidden="true" /> Save
          </b-button>

          <b-button variant="secondary" @click="onCloseEditor">
            <b-icon icon="x" aria-hidden="true" /> Close
          </b-button>
        </template>

        <!-- Text part -->
        <template v-else>
          <div>{{ section.text }}</div>
          <b-button @click="onOpenEditor">
            <b-icon icon="pencil" aria-hidden="true" /> Edit
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
import Editor from '@/components/Editor.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import Quiz from '@/components/Quiz.vue'
import Section from '@/models/Section'

export default {
  name: 'SectionDetail',
  components: {
    Editor,
    ErrorMessage,
    Quiz
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
      saving: false,
      unsavedEdits: false,
    }
  },
  created() {
    window.addEventListener('beforeunload', this.preventNavIfEditing)
    this.loading = true
    return Section
      .include('questions.answers')
      .find(this.sectionId)
      .then(response => {
        this.section = response
      })
      .catch(error => {
        this.error = 'Could not load section.'
        console.error(this.error, error)
      })
      .finally(() => this.loading = false)
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.preventNavIfEditing)
  },
  methods: {
    confirmLeave() {
      return window.confirm("You have unsaved changes. Do you want to discard them?")
    },
    onCloseEditor() {
      if(!this.unsavedEdits || this.confirmLeave()) {
        this.editing = false
        this.unsavedEdits = false
      }
    },
    onEditorBecameDirty() {
      this.unsavedEdits = true
    },
    onEditorBecameClean() {
      this.unsavedEdits = false
    },
    onOpenEditor() {
      this.editing = true
    },
    onSave() {
      this.saving = true
      setTimeout(() => {
        // Simulate success
        this.saving = false
        this.unsavedEdits = false
        this.$emit('editor-saved')
      }, 500)
    },
    preventNavIfEditing(event) {
      if(this.unsavedEdits && !this.confirmLeave()) {
        event.preventDefault()
        event.returnValue = ''
      }
    }
  },
}
</script>

<style lang="scss">
.collapsed > .when-open,
.not-collapsed > .when-closed {
  display: none;
}
</style>
