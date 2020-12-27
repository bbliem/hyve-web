<template>
  <SimpleForm
    :title="$t('login')"
    :submit-button-text="$t('login')"
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
    <SimpleFormInput
      id="password"
      v-model="password"
      :label="$t('password-field-label')"
      :fallback-invalid-feedback="this.$t('password-invalid')"
      :placeholder="$t('enter-your-password')"
      type="password"
      :validation-error="passwordValidationError"
      @input="passwordValidationError = null"
    />

    <template #after-button>
      <p class="text-center">
        <router-link :to="{ name: 'request-password-reset' }">
          {{ $t('forgot-password') }}
        </router-link>
      </p>
    </template>

    <template #footer>
      <p class="text-center">
        {{ $t('no-account') }}
        <router-link :to="{ name: 'register', query: $route.query }">
          {{ $t('to-registration') }}
        </router-link>
      </p>
    </template>
  </SimpleForm>
</template>

<script>
import authenticationMixin, { isValidEmail } from '@/mixins/authenticationMixin'
import SimpleForm from '@/components/SimpleForm'
import SimpleFormInput from '@/components/SimpleFormInput'

export default {
  name: 'Login',
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
    }
  },
  computed: {
    isEmailValid() {
      return isValidEmail(this.email)
    },
    isFormValid() {
      return this.isEmailValid && !this.emailValidationError && this.password && !this.passwordValidationError
    },
  },
  methods: {
    async onSubmit() {
      try {
        await this.login(this.email, this.password)
        this.emailValidationError = null
        this.passwordValidationError = null
      } catch(error) {
        this.emailValidationError = error.validationErrors.email ? error.validationErrors.email[0] : null
        this.passwordValidationError = error.validationErrors.password ? error.validationErrors.password[0] : null
      }
    }
  },
}
</script>
