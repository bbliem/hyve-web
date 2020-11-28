<template>
  <b-card>
    <FetchedContent :fetch="fetch" :error-message="$t('could-not-load-section')">
      <template v-if="section">
        <EditableText :on-save="onSaveText" :text="section.text" />

        <!-- Quiz -->
        <p v-if="section.questions.length">
          <Quiz :questions="section.questions" :section-id="sectionId" />
        </p>
      </template>
    </FetchedContent>
  </b-card>
</template>

<script>
import FetchedContent from '@/components/FetchedContent.vue'
import EditableText from '@/components/EditableText.vue'
import Quiz from '@/components/Quiz.vue'
import Section from '@/models/Section'

export default {
  name: 'SectionDetail',
  components: {
    EditableText,
    FetchedContent,
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
      editing: false,
    }
  },
  methods: {
    async fetch() {
      this.section = await Section
        .include('questions.answers')
        .find(this.sectionId)
    },
    async onSaveText(text) {
      await this.section.updateFieldAndSave('text', text, ['questions'])
    },
  },
}
</script>
