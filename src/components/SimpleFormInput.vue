<template>
  <b-form-group
    :label="label"
    :label-for="id"
    :state="state"
    :invalid-feedback="invalidFeedback"
  >
    <b-form-input
      :id="id"
      :placeholder="placeholder"
      :state="state"
      :type="type"
      :value="value"
      required
      @input="$emit('input', $event)"
    />
    <!-- TODO allow extra attributes such as `trim` (e.g., for email addresses) be added to b-form-input -->
  </b-form-group>
</template>

<script>
export default {
  name: 'SimpleFormInput',
  props: {
    id: {
      required: true,
      type: String,
    },
    label: {
      required: true,
      type: String,
    },
    fallbackInvalidFeedback: {
      required: true,
      type: String,
    },
    placeholder: {
      required: false,
      type: String,
      default: undefined,
    },
    type: {
      required: false,
      type: String,
      default: undefined,
    },
    valid: {
      type: Boolean,
      default: true,
    },
    validationError: {
      type: String,
      default: '',
    },
    value: {
      required: true,
      type: String,
    },
  },
  computed: {
    invalidFeedback() {
      return this.validationError || this.fallbackInvalidFeedback
    },
    state() {
      if(this.validationError) {
        return false
      }
      return this.value ? this.valid : null
    },
  },
}
</script>
