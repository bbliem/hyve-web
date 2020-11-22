<template>
  <div class="editor" @click.prevent>
    <template v-if="multiLine">
      <EditorMenuBar v-slot="{ commands, isActive }" :editor="editor">
        <b-button-toolbar key-nav aria-label="Text editor toolbar">
          <b-button-group class="mr-1">
            <b-button
              :title="$t('editor.undo')"
              @click="commands.undo"
            >
              <b-icon icon="arrow-counterclockwise" aria-hidden="true" />
            </b-button>
            <b-button
              :title="$t('editor.redo')"
              @click="commands.redo"
            >
              <b-icon icon="arrow-clockwise" aria-hidden="true" />
            </b-button>
          </b-button-group>

          <b-button-group class="mr-1">
            <b-button
              :title="$t('editor.h1')"
              :class="{ 'active': isActive.heading({ level: 1 }) }"
              @click="commands.heading({ level: 1 })"
            >
              <b-icon icon="type-h1" aria-hidden="true" />
            </b-button>
            <b-button
              :title="$t('editor.h2')"
              :class="{ 'active': isActive.heading({ level: 2 }) }"
              @click="commands.heading({ level: 2 })"
            >
              <b-icon icon="type-h2" aria-hidden="true" />
            </b-button>
            <b-button
              :title="$t('editor.h3')"
              :class="{ 'active': isActive.heading({ level: 3 }) }"
              @click="commands.heading({ level: 3 })"
            >
              <b-icon icon="type-h3" aria-hidden="true" />
            </b-button>
          </b-button-group>

          <b-button-group class="mr-1">
            <b-button
              :title="$t('editor.bold')"
              :class="{ 'active': isActive.bold() }"
              @click="commands.bold"
            >
              <b-icon icon="type-bold" aria-hidden="true" />
            </b-button>
            <b-button
              :title="$t('editor.italic')"
              :class="{ 'active': isActive.italic() }"
              @click="commands.italic"
            >
              <b-icon icon="type-italic" aria-hidden="true" />
            </b-button>
            <b-button
              :title="$t('editor.underline')"
              :class="{ 'active': isActive.underline() }"
              @click="commands.underline"
            >
              <b-icon icon="type-underline" aria-hidden="true" />
            </b-button>
            <b-button
              :title="$t('editor.strikethrough')"
              :class="{ 'active': isActive.strike() }"
              @click="commands.strike"
            >
              <b-icon icon="type-strikethrough" aria-hidden="true" />
            </b-button>
          </b-button-group>

          <b-button-group class="mr-1">
            <b-button
              :title="$t('editor.bullet-list')"
              :class="{ 'active': isActive.bullet_list() }"
              @click="commands.bullet_list"
            >
              <b-icon icon="list-ul" aria-hidden="true" />
            </b-button>
            <b-button
              :title="$t('editor.numbered-list')"
              :class="{ 'active': isActive.ordered_list() }"
              @click="commands.ordered_list"
            >
              <b-icon icon="list-ol" aria-hidden="true" />
            </b-button>
            <b-button
              :title="$t('editor.blockquote')"
              :class="{ 'active': isActive.blockquote() }"
              @click="commands.blockquote"
            >
              <b-icon icon="blockquote-left" aria-hidden="true" />
            </b-button>
          </b-button-group>
        </b-button-toolbar>
      </EditorMenuBar>
    </template>

    <EditorContent :editor="editor" class="editor-content" />

    <b-button v-if="saving" disabled variant="primary">
      <b-spinner small /> {{ $t('editor.saving') }}
    </b-button>
    <b-button
      v-else
      variant="primary"
      :disabled="!unsavedEdits"
      class="mr-1"
      @click="save"
    >
      <b-icon icon="check" aria-hidden="true" /> {{ $t('editor.save') }}
    </b-button>

    <b-button variant="secondary" @click="closeEditor">
      <b-icon icon="x" aria-hidden="true" /> {{ $t('editor.close') }}
    </b-button>
  </div>
</template>

<script>
import {
  Doc,
  Editor,
  EditorContent,
  EditorMenuBar,
  Paragraph,
  Text,
} from 'tiptap'
import {
  Blockquote,
  Bold,
  BulletList,
  Heading,
  History,
  Italic,
  ListItem,
  OrderedList,
  Placeholder,
  Strike,
  Underline,
} from 'tiptap-extensions'

// Replacement for tiptap Doc so that the document is only a single text node -- no HTML tags
// Resources:
// https://github.com/ueberdosis/tiptap/blob/main/examples/Components/Routes/Title/Doc.js
// https://github.com/ueberdosis/tiptap/issues/96
// https://prosemirror.net/examples/schema/
class TextNodeDoc extends Doc {
  get schema() {
    return {
      content: 'text*',
    }
  }
}

export default {
  name: 'Editor',
  components: {
    EditorMenuBar,
    EditorContent,
  },
  props: {
    content: {
      type: String,
      default: '',
    },
    onSave: {
      type: Function,
      required: true,
    },
    multiLine: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      cleanDoc: null, // when the current document is equal to this, it is considered "clean"
      editor: null,
      saving: false,
    }
  },
  computed: {
    unsavedEdits() {
      return !this.editor.state.doc.eq(this.cleanDoc)
    }
  },
  created() {
    var extensions;
    if(this.multiLine) {
      extensions = [
        new Blockquote(),
        new Bold(),
        new BulletList(),
        new Heading({ levels: [1, 2, 3] }),
        new History(),
        new Italic(),
        //new Link(),
        new ListItem(),
        new OrderedList(),
        new Placeholder({
          emptyNodeText: this.$t('editor.enter-text-here')
        }),
        new Strike(),
        new Underline(),
      ]
    } else {
      extensions = [
        new TextNodeDoc(),
        new Paragraph(),
        new Text(),
        new Placeholder({
          emptyNodeText: this.$t('editor.enter-text-here')
        }),
      ]
    }
    this.editor = new Editor({
      useBuiltInExtensions: this.multiLine,
      content: this.content,
      extensions: extensions,
      onInit: ({ state }) => {
        this.cleanDoc = state.doc
      },
    })
    window.addEventListener('beforeunload', this.preventNavIfEditing)
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.preventNavIfEditing)
    this.editor.destroy()
  },
  beforeRouteLeave(to, from, next) {
    if(!this.preventNavIfEditing())
      next()
  },
  methods: {
    confirmLeave() {
      return window.confirm(this.$t('editor.save-unsaved-changes-prompt'))
    },
    closeEditor() {
      if(!this.unsavedEdits || this.confirmLeave()) {
        this.$emit('close-editor')
      }
    },
    async save() {
      this.saving = true
      //await new Promise(resolve => setTimeout(resolve, 200))
      try {
        await this.onSave(this.editor.getHTML())
        this.cleanDoc = this.editor.state.doc
        this.closeEditor()
      } catch(error) {
        this.$root.$bvToast.toast(error.toString(), {
          title: this.$t('editor.saving-failed'),
          variant: 'danger',
          solid: true,
          toaster: 'b-toaster-bottom-right'
        })
      } finally {
        this.saving = false
      }
    },
    preventNavIfEditing(event) {
      if(this.unsavedEdits && !this.confirmLeave()) {
        event.preventDefault()
        event.returnValue = ''
        return true
      }
      return false
    },
  },
}
</script>

<style lang="scss">
.editor {
  max-width: 50rem;
  margin: 0.5rem 0 0.5rem 0;

  p.is-editor-empty:first-child::before {
    content: attr(data-empty-text);
    float: left;
    color: #aaa;
    pointer-events: none;
    height: 0;
    font-style: italic;
  }
}

.editor-content {
  margin: 0.2rem 0 0.2rem 0;
  padding: 0.5rem;
  border: 2px solid $middle-grey;
  border-radius: 4px;

  blockquote {
    border-left: 3px solid rgba($middle-grey, 0.5);
    color: rgba($middle-grey, 0.9);
    padding-left: 0.8rem;
    font-style: italic;

    p {
      margin: 0;
    }
  }
}
</style>
