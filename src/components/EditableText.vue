<template>
  <div>
    <!-- Editor for text part -->
    <template v-if="editing">
      <Editor
        :content="text"
        :multi-line="multiLine"
        :on-save="onSave"
        @close-editor="closeEditor"
      />
    </template>

    <!-- Text part -->
    <div v-else style="display: flex">
      <b-button v-if="showEditButton" style="margin-right: 0.5em" variant="light" @click="openEditor">
        <b-icon icon="pencil" aria-hidden="true" :title="$t('edit')" />
      </b-button>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="text" />
    </div>
  </div>
</template>

<script>
import { state } from '@/store'
import Editor from '@/components/Editor.vue'

export default {
  name: 'EditableText',
  components: {
    Editor,
  },
  props: {
    multiLine: {
      type: Boolean,
      default: true
    },
    onSave: {
      type: Function,
      required: true
    },
    text: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      editing: false,
    }
  },
  computed: {
    showEditButton() {
      return state.editMode
    },
  },
  methods: {
    openEditor() {
      this.editing = true
    },
    closeEditor() {
      this.editing = false
    },
  },
}
</script>
