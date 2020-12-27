<template>
  <SimpleForm
    :title="$t('register')"
    :submit-button-text="$t('register')"
    :disable-submit="!isFormValid"
    @submit="onSubmit"
  >
    <SimpleFormInput
      id="email"
      v-model="email"
      type="email"
      :label="$t('email-address-field-label')"
      :fallback-invalid-feedback="this.$t('email-address-invalid')"
      :placeholder="$t('enter-your-email')"
      :valid="isEmailValid"
      :validation-error="emailValidationError"
      @input="emailValidationError = null"
    />
    <SimpleFormInput
      id="password"
      v-model="password"
      type="password"
      :label="$t('password-field-label')"
      :fallback-invalid-feedback="this.$t('password-invalid')"
      :placeholder="$t('enter-your-password')"
      :validation-error="passwordValidationError"
      @input="passwordValidationError = null"
    />
    <SimpleFormInput
      id="password2"
      v-model="password2"
      type="password"
      :label="$t('password-confirmation-field-label')"
      :fallback-invalid-feedback="$t('passwords-do-not-match')"
      :placeholder="$t('enter-your-password')"
      :valid="passwordsMatch"
    />
  </SimpleForm>
</template>

<script>
import authenticationMixin, { isValidEmail } from '@/mixins/authenticationMixin'
import SimpleForm from '@/components/SimpleForm'
import SimpleFormInput from '@/components/SimpleFormInput'

export default {
  name: 'Register',
  components: {
    SimpleForm,
    SimpleFormInput,
  },
  mixins: [authenticationMixin],
  data() {
    return {
      email : '',
      emailValidationError: null,
      password : '',
      passwordValidationError: null,
      password2 : '',
    }
  },
  computed: {
    isEmailValid() {
      return isValidEmail(this.email)
    },
    isFormValid() {
      return this.isEmailValid && !this.emailValidationError && this.password && !this.passwordValidationError && this.passwordsMatch
    },
    passwordsMatch() {
      return this.password === this.password2
    },
  },
  methods: {
    async onSubmit() {
      try {
        await this.register(this.email, this.password)
        this.emailValidationError = null
        this.passwordValidationError = null
        this.password2ValidationError = null
      } catch(error) {
        this.emailValidationError = error.validationErrors.email ? error.validationErrors.email[0] : null
        this.passwordValidationError = error.validationErrors.password ? error.validationErrors.password[0] : null
      }
    }
  },
}
</script>
