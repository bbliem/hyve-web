<template>
  <div>
    <div class="text-center">
      <b-spinner v-if="loading" />
    </div>
    <template v-if="page">
      <h1>
        <!-- Editor for title part -->
        <template v-if="editingTitle">
          <Editor :content="page.title" :on-save="onSaveTitle" :multi-line="false" @close-editor="closeTitleEditor" />
        </template>

        <!-- Title part -->
        <template v-else>
          {{ page.title }}
          <b-button v-if="canEdit" @click="openTitleEditor">
            <b-icon icon="pencil" aria-hidden="true" /> Edit
          </b-button>
        </template>
      </h1>

      <!-- Editor for content part -->
      <template v-if="editingContent">
        <Editor :content="page.content" :on-save="onSaveContent" @close-editor="closeContentEditor" />
      </template>

      <!-- Content part -->
      <template v-else>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-html="page.content" />
        <b-button v-if="canEdit" @click="openContentEditor">
          <b-icon icon="pencil" aria-hidden="true" /> Edit
        </b-button>
      </template>
    </template>
    <ErrorMessage v-else-if="error" :message="error" />
  </div>
</template>

<script>
import { state } from '@/store'
import Editor from '@/components/Editor.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import StaticPage from '@/models/StaticPage'

export default {
  name: 'StaticPage',
  components: {
    Editor,
    ErrorMessage,
  },
  props: {
    staticPageId: {
      type: Number,
      required: true
    },
  },
  data() {
    return {
      page: null,
      error: null,
      loading: false,
      editingTitle: false,
      editingContent: false,
    }
  },
  computed: {
    canEdit() {
      return state.user && state.user.isSuperuser
    },
  },
  created() {
    this.loading = true
    return StaticPage
      .find(this.staticPageId)
      .then(response => {
        this.page = response
      })
      .catch(error => {
        this.error = 'Could not load page.'
        console.error(this.error, error)
      })
      .finally(() => this.loading = false)
  },
  methods: {
    openTitleEditor() {
      this.editingTitle = true
    },
    closeTitleEditor() {
      this.editingTitle = false
    },
    async onSaveTitle(title) {
      const oldTitle = this.page.title
      this.page.title = title
      try {
        await this.page.save()
      } catch(error) {
        this.page.title = oldTitle
        throw error
      }
    },
    openContentEditor() {
      this.editingContent = true
    },
    closeContentEditor() {
      this.editingContent = false
    },
    async onSaveContent(content) {
      const oldContent = this.page.content
      this.page.content = content
      try {
        await this.page.save()
      } catch(error) {
        this.page.content = oldContent
        throw error
      }
    },
  },
}
</script>
