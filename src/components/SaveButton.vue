<template>
  <b-button
    :disabled="disabled || saving"
    variant="primary"
    @click="save"
  >
    <template v-if="saving">
      <b-spinner small /> {{ $t('saving') }}
    </template>
    <template v-else>
      <b-icon icon="check" aria-hidden="true" /> {{ $t('save') }}
    </template>
  </b-button>
</template>

<script>
export default {
  name: 'SaveButton',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    onSave: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      saving: false,
    }
  },
  methods: {
    async save() {
      this.saving = true
      try {
        await this.onSave()
      } catch(error) {
        this.$root.$bvToast.toast(error.toString(), {
          title: this.$t('saving-failed'),
          variant: 'danger',
          solid: true,
          toaster: 'b-toaster-bottom-right'
        })
      } finally {
        this.saving = false
      }
    },
  },
}
</script>
