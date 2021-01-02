<template>
  <SimpleForm
    :title="$t('change-password')"
    :submit-button-text="$t('change-password')"
    :disable-submit="!isFormValid"
    @submit="onSubmit"
  >
    <SimpleFormInput
      id="current-password"
      v-model="currentPassword"
      type="password"
      :label="$t('current-password-field-label')"
      :fallback-invalid-feedback="this.$t('password-invalid')"
      :placeholder="$t('enter-your-current-password')"
      :validation-error="currentPasswordValidationError"
      @input="currentPasswordValidationError = null"
    />
    <SimpleFormInput
      id="new-password"
      v-model="newPassword"
      type="password"
      :label="$t('new-password-field-label')"
      :fallback-invalid-feedback="this.$t('password-invalid')"
      :placeholder="$t('enter-your-new-password')"
      :validation-error="newPasswordValidationError"
      @input="newPasswordValidationError = null"
    />
    <SimpleFormInput
      id="newPassword2"
      v-model="newPassword2"
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
  name: 'ChangePassword',
  components: {
    SimpleForm,
    SimpleFormInput,
  },
  mixins: [authenticationMixin],
  data() {
    return {
      currentPassword : '',
      currentPasswordValidationError: null,
      newPassword : '',
      newPasswordValidationError: null,
      newPassword2 : '',
    }
  },
  computed: {
    isFormValid() {
      return this.currentPassword && !this.currentPasswordValidationError && this.newPassword && !this.newPasswordValidationError && this.passwordsMatch
    },
    passwordsMatch() {
      return this.newPassword === this.newPassword2
    },
  },
  methods: {
    async onSubmit() {
      try {
        await this.changePassword(this.currentPassword, this.newPassword)
        this.currentPasswordValidationError = null
        this.newPasswordValidationError = null
      } catch(error) {
        this.currentPasswordValidationError = error.validationErrors.currentPassword ? error.validationErrors.currentPassword[0] : null
        this.newPasswordValidationError = error.validationErrors.newPassword ? error.validationErrors.newPassword[0] : null
      }
    }
  },
}
</script>
