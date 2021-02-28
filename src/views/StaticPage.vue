<template>
  <FetchedContent :fetch="fetch" :error-message="$t('could-not-load-page')">
    <template v-if="page">
      <h1><EditableText :on-save="onSaveTitle" :multi-line="false" :text="page.title" /></h1>
      <EditableText :on-save="onSaveContent" :text="page.body" />
    </template>
  </FetchedContent>
</template>

<script>
import EditableText from '@/components/EditableText.vue'
import FetchedContent from '@/components/FetchedContent.vue'
import StaticPage from '@/models/StaticPage'

export default {
  name: 'StaticPage',
  components: {
    EditableText,
    FetchedContent,
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
    }
  },
  methods: {
    async fetch() {
      this.page = await StaticPage.find(this.staticPageId)
    },
    async onSaveTitle(title) {
      await this.page.updateFieldAndSave('title', title)
    },
    async onSaveContent(content) {
      await this.page.updateFieldAndSave('body', content)
    },
  },
}
</script>
