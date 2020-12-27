<template>
  <SimpleForm
    :title="$t('reset-password')"
    :submit-button-text="$t('reset-password')"
    :disable-submit="!isFormValid"
    @submit="onSubmit"
  >
    <SimpleFormInput
      id="email"
      v-model="email"
      :label="$t('email-address-field-label')"
      :fallback-invalid-feedback="this.$t('email-address-invalid')"
      :placeholder="$t('enter-your-email')"
      type="email"
      :valid="isEmailValid"
      :validation-error="emailValidationError"
      @input="emailValidationError = null"
    />
  </SimpleForm>
</template>

<script>
import authenticationMixin, { isValidEmail } from '@/mixins/authenticationMixin'
import SimpleForm from '@/components/SimpleForm'
import SimpleFormInput from '@/components/SimpleFormInput'

export default {
  name: 'RequestPasswordReset',
  components: {
    SimpleForm,
    SimpleFormInput,
  },
  mixins: [authenticationMixin],
  data() {
    return {
      email : '',
      emailValidationError: null,
    }
  },
  computed: {
    isEmailValid() {
      return isValidEmail(this.email)
    },
    isFormValid() {
      return this.isEmailValid && !this.emailValidationError
    },
  },
  methods: {
    async onSubmit() {
      try {
        await this.requestPasswordReset(this.email)
        this.emailValidationError = null
      } catch(error) {
        this.emailValidationError = error.validationErrors.email ? error.validationErrors.email[0] : null
      }
    }
  },
}
</script>
