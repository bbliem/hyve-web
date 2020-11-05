<template>
  <div class="editor">
    <b-card no-body>
      <b-button v-b-toggle.collapse-editor variant="light" block class="text-left">
        <span class="when-closed">
          <b-icon icon="chevron-down" aria-hidden="true" /> Show editor
        </span>
        <span class="when-open">
          <b-icon icon="chevron-up" aria-hidden="true" /> Hide editor
        </span>
      </b-button>
      <b-collapse id="collapse-editor">
        <b-card-body>
          <EditorMenuBar v-slot="{ commands, isActive }" :editor="editor">
            <b-button-toolbar key-nav aria-label="Text editor toolbar">
              <b-button-group class="mr-1">
                <b-button
                  title="Undo"
                  @click="commands.undo"
                >
                  <b-icon icon="arrow-counterclockwise" aria-hidden="true" />
                </b-button>
                <b-button
                  title="Redo"
                  @click="commands.redo"
                >
                  <b-icon icon="arrow-clockwise" aria-hidden="true" />
                </b-button>
              </b-button-group>

              <b-button-group class="mr-1">
                <b-button
                  title="Headline 1"
                  :class="{ 'active': isActive.heading({ level: 1 }) }"
                  @click="commands.heading({ level: 1 })"
                >
                  <b-icon icon="type-h1" aria-hidden="true" />
                </b-button>
                <b-button
                  title="Headline 2"
                  :class="{ 'active': isActive.heading({ level: 2 }) }"
                  @click="commands.heading({ level: 2 })"
                >
                  <b-icon icon="type-h2" aria-hidden="true" />
                </b-button>
                <b-button
                  title="Headline 3"
                  :class="{ 'active': isActive.heading({ level: 3 }) }"
                  @click="commands.heading({ level: 3 })"
                >
                  <b-icon icon="type-h3" aria-hidden="true" />
                </b-button>
              </b-button-group>

              <b-button-group class="mr-1">
                <b-button
                  title="Bold"
                  :class="{ 'active': isActive.bold() }"
                  @click="commands.bold"
                >
                  <b-icon icon="type-bold" aria-hidden="true" />
                </b-button>
                <b-button
                  title="Italic"
                  :class="{ 'active': isActive.italic() }"
                  @click="commands.italic"
                >
                  <b-icon icon="type-italic" aria-hidden="true" />
                </b-button>
                <b-button
                  title="Underline"
                  :class="{ 'active': isActive.underline() }"
                  @click="commands.underline"
                >
                  <b-icon icon="type-underline" aria-hidden="true" />
                </b-button>
                <b-button
                  title="Strikethrough"
                  :class="{ 'active': isActive.strike() }"
                  @click="commands.strike"
                >
                  <b-icon icon="type-strikethrough" aria-hidden="true" />
                </b-button>
              </b-button-group>

              <b-button-group class="mr-1">
                <b-button
                  title="Bullet list"
                  :class="{ 'active': isActive.bullet_list() }"
                  @click="commands.bullet_list"
                >
                  <b-icon icon="list-ul" aria-hidden="true" />
                </b-button>
                <b-button
                  title="Ordered list"
                  :class="{ 'active': isActive.ordered_list() }"
                  @click="commands.ordered_list"
                >
                  <b-icon icon="list-ol" aria-hidden="true" />
                </b-button>
                <b-button
                  title="Blockquote"
                  :class="{ 'active': isActive.blockquote() }"
                  @click="commands.blockquote"
                >
                  <b-icon icon="blockquote-left" aria-hidden="true" />
                </b-button>
              </b-button-group>
            </b-button-toolbar>
          </EditorMenuBar>
          <EditorContent :editor="editor" class="editor-content" />
          <b-button variant="primary">
            <b-icon icon="check" aria-hidden="true" /> Save
          </b-button>
        </b-card-body>
      </b-collapse>
    </b-card>
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
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
  Underline
} from 'tiptap-extensions'

export default {
  name: 'Editor',
  components: {
    EditorMenuBar,
    EditorContent
  },
  data() {
    return {
      editor: new Editor({
        //content: '<p>Foo</p>',
        extensions: [
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
            emptyNodeText: 'Enter text here...'
          }),
          new Strike(),
          new Underline(),
        ]
      })
    }
  },
  beforeDestroy() {
    this.editor.destroy()
  }
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
