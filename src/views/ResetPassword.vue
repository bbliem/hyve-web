<template>
  <SimpleForm
    :title="$t('reset-password')"
    :submit-button-text="$t('reset-password')"
    :disable-submit="!isFormValid"
    @submit="onSubmit"
  >
    <SimpleFormInput
      id="password"
      v-model="password"
      type="password"
      :label="$t('new-password-field-label')"
      :fallback-invalid-feedback="this.$t('password-invalid')"
      :placeholder="$t('enter-your-new-password')"
      :validation-error="passwordValidationError"
      @input="passwordValidationError = null"
    />
    <SimpleFormInput
      id="password2"
      v-model="password2"
      type="password"
      :label="$t('password-confirmation-field-label')"
      :fallback-invalid-feedback="$t('passwords-do-not-match')"
      :placeholder="$t('enter-your-new-password')"
      :valid="passwordsMatch"
    />
  </SimpleForm>
</template>

<script>
import authenticationMixin from '@/mixins/authenticationMixin'
import SimpleForm from '@/components/SimpleForm'
import SimpleFormInput from '@/components/SimpleFormInput'

export default {
  name: 'ResetPassword',
  components: {
    SimpleForm,
    SimpleFormInput,
  },
  mixins: [authenticationMixin],
  props: {
    uid: {
      required: true,
      type: String,
    },
    token: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      password : '',
      passwordValidationError: null,
      password2 : '',
    }
  },
  computed: {
    isFormValid() {
      return this.password && !this.passwordValidationError && this.passwordsMatch
    },
    passwordsMatch() {
      return this.password === this.password2
    },
  },
  methods: {
    async onSubmit() {
      try {
        await this.resetPassword(this.uid, this.token, this.password)
        this.passwordValidationError = null
      } catch(error) {
        this.passwordValidationError = error.validationErrors.newPassword ? error.validationErrors.newPassword[0] : null
      }
    }
  },
}
</script>
