<template>
  <div>
    <div class="register-form">
      <h1>{{ $t('register') }}</h1>
      <b-form :model="isFormValid" @submit.prevent="onSubmit">
        <b-form-group
          id="form-group-email"
          :label="$t('email-address-field-label')"
          label-for="email"
          :state="emailState"
          :invalid-feedback="emailInvalidFeedback"
        >
          <b-form-input
            id="email"
            v-model="email"
            required
            type="email"
            :placeholder="$t('enter-your-email')"
            :state="emailState"
            trim
            @input="emailValidationError = null"
          />
        </b-form-group>
        <b-form-group
          id="form-group-password"
          :label="$t('password-field-label')"
          label-for="password"
          :state="passwordState"
          :invalid-feedback="passwordInvalidFeedback"
        >
          <b-form-input
            id="password"
            v-model="password"
            required
            type="password"
            :placeholder="$t('enter-your-password')"
            :state="passwordState"
            @input="passwordValidationError = null"
          />
        </b-form-group>
        <b-form-group
          id="form-group-password2"
          :label="$t('password-confirmation-field-label')"
          label-for="password2"
          :state="passwordConfirmationState"
          :invalid-feedback="$t('passwords-do-not-match')"
        >
          <b-form-input
            id="password2"
            v-model="password2"
            required
            type="password"
            :placeholder="$t('enter-your-password')"
            :state="passwordConfirmationState"
            @input="passwordValidationError = null"
          />
        </b-form-group>

        <b-button
          type="submit"
          class="mb-3"
          block
          :disabled="!isFormValid"
        >
          {{ $t('register') }}
        </b-button>
      </b-form>
    </div>
  </div>
</template>

<script>
import authenticationMixin from '@/mixins/authenticationMixin'

export default {
  name: 'Register',
  mixins: [authenticationMixin],
  data() {
    return {
      email : '',
      emailValidationError: null,
      password : '',
      password2 : '',
      passwordValidationError: null,
    }
  },
  computed: {
    emailInvalidFeedback() {
      return this.emailValidationError || this.$t('email-address-invalid')
    },
    emailState() {
      if(this.emailValidationError) {
        return false
      }
      return this.email ? this.isEmailValid : null
    },
    passwordInvalidFeedback() {
      return this.passwordValidationError || this.$t('password-invalid')
    },
    passwordState() {
      if(this.passwordValidationError) {
        return false
      }
      return this.password ? true : null
    },
    passwordConfirmationState() {
      return this.password ? this.password === this.password2 : null
    },
    isEmailValid() {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(this.email)
    },
    isFormValid() {
      return this.emailState && this.passwordState && this.passwordConfirmationState
    },
  },
  methods: {
    async onSubmit() {
      try {
        await this.register(this.email, this.password)
        this.emailValidationError = null
        this.passwordValidationError = null
      } catch(error) {
        this.emailValidationError = error.validationErrors.email ? error.validationErrors.email[0] : null
        this.passwordValidationError = error.validationErrors.password ? error.validationErrors.password[0] : null
      }
    },
  },
}
</script>

<style lang="scss">
.register-form {
  max-width: 340px;
  align: center;
  margin: 20px auto;

  form {
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
    padding: 20px;
  }

  h1 {
    margin: 0 0 15px;
    text-align: center;
  }
}
</style>
