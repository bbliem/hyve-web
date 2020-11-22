<template>
  <div>
    <div class="text-center">
      <b-spinner v-if="loading" />
    </div>
    <template v-if="page">
      <h1><EditableText :on-save="onSaveTitle" :multi-line="false" :text="page.title" /></h1>
      <EditableText :on-save="onSaveContent" :text="page.content" />
    </template>
    <ErrorMessage v-else-if="error" :message="error" />
  </div>
</template>

<script>
import EditableText from '@/components/EditableText.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import StaticPage from '@/models/StaticPage'

export default {
  name: 'StaticPage',
  components: {
    EditableText,
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
    }
  },
  created() {
    this.loading = true
    return StaticPage
      .find(this.staticPageId)
      .then(response => {
        this.page = response
      })
      .catch(error => {
        this.error = this.$t('could-not-load-page')
        console.error(this.error, error)
      })
      .finally(() => this.loading = false)
  },
  methods: {
    async onSaveTitle(title) {
      await this.page.updateFieldAndSave('title', title)
    },
    async onSaveContent(content) {
      await this.page.updateFieldAndSave('content', content)
    },
  },
}
</script>
