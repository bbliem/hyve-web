import { changePassword, emailToUsername, login, logout, register, requestPasswordReset, resetPassword } from '@/auth'
import { resetUser, setUser } from '@/store'

function isClientErrorResponse(response) {
  return response && response.status >= 400 && response.status < 500
}

function getValidationErrors(error) {
  // Return object with validation errors according to the given exception,
  // return null if there were none.
  // If there were validation errors, error.response.data is (hopefully) an
  // object mapping a field name to an explanation why there was a validation
  // error with that field.
  return isClientErrorResponse(error.response) ? error.response.data : null
}

export function isValidEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

export default {
  computed: {
    user() { return this.$state.user }
  },
  methods: {
    async changePassword(currentPassword, newPassword) {
      // Set the password to the given one. Throws an error if it failed.
      // If there were validation errors, the thrown object `error` will have a
      // property called `validationErrors` so that `error.validationErrors`
      // maps backend field names to errors.
      try {
        await changePassword(currentPassword, newPassword)
        console.log(`Password changed.`)
        this.showToast(this.$t('password-change-successful'), this.$t('you-can-log-in-with-new-password'), 'success')
        const to = this.$route.query.redirect || { name: 'home' }
        this.$router.push(to).catch(() => {})
      } catch(error) {
        error.validationErrors = getValidationErrors(error)
        const errorMessage = error.validationErrors ? this.$t('check-all-fields-valid') : this.$t('unexpected-error')
        this.showToast(this.$t('could-not-change-password'), errorMessage, 'danger')
        console.error("Changing password failed:", error)
        throw error
      }
    },

    async login(email, password, admin=false) {
      try {
        setUser(await login(email, password, admin))
        console.log(`Sucessfully logged in as user ${this.$state.user.name}.`)
        const greeting = this.$state.user.name ? this.$t('welcome-back-name', { name: this.$state.user.name }) : this.$t('welcome-back')
        this.showToast(this.$t('login-successful'), greeting, 'success')
        // Ignoring errors because if we are already at the target there will be an error
        const to = this.$route.query.redirect || { name: 'home' }
        this.$router.push(to).catch(() => {})
      } catch(error) {
        error.validationErrors = getValidationErrors(error)
        const errorMessage = error.validationErrors ? this.$t('check-email-and-password') : this.$t('unexpected-error')
        this.showToast(this.$t('login-failed'), errorMessage, 'danger')
        console.error("Login failed:", error)
        throw error
      }
    },

    async logout() {
      // Ignoring errors because if we are already at the target there will be an error
      this.$router.push({ name: 'home' }).catch(() => {})
      var name = this.$state.user ? this.$state.user.name : undefined
      const personalizedMessage = name ? this.$t('see-you-again-soon-name', { name }) : this.$t('see-you-again-soon')
      resetUser()
      await logout()
      console.log("Logged out.")
      this.showToast(this.$t('logged-out'), personalizedMessage, 'info')
    },

    async updateProfile(email, name, avatar) {
      const unexpandFields = [
        'multipleChoiceResponses',
        'openQuestionResponses',
        'blockCompletions',
      ]
      try {
        await this.$state.user.updateFieldsAndSave({
          username: emailToUsername(email, this.$state.user.isSuperuser),
          email: email,
          name: name,
          avatar: avatar,
        }, unexpandFields)
        //this.getDataFromStore()
        this.showToast(this.$t('profile-updated'), this.$t('your-changes-have-been-saved'), 'success')
      } catch(error) {
        error.validationErrors = getValidationErrors(error)
        const errorMessage = error.validationErrors ? this.$t('check-all-fields-valid') : this.$t('unexpected-error')
        this.showToast(this.$t('saving-failed'), errorMessage, 'danger')
        console.error("Updating profile failed:", error)
        throw error
      }
    },

    async register(email, password) {
      // Register the user with the given data. Throws an error if it failed.
      // If there were validation errors, the thrown object `error` will have a
      // property called `validationErrors` so that `error.validationErrors`
      // maps backend field names to errors.
      try {
        await register(email, password)
        console.log(`Registered as ${email}.`)
        setUser(await login(email, password))
        this.showToast(this.$t('registration-successful'), this.$t('welcome'), 'success')
        const to = this.$route.query.redirect || { name: 'home' }
        this.$router.push(to).catch(() => {})
      } catch(error) {
        error.validationErrors = getValidationErrors(error)
        const errorMessage = error.validationErrors ? this.$t('check-all-fields-valid') : this.$t('unexpected-error')
        this.showToast(this.$t('registration-failed'), errorMessage, 'danger')
        console.error("Registration failed:", error)
        throw error
      }
    },

    async resetPassword(uid, token, password) {
      // Reset the password to the given one. Throws an error if it failed.
      // If there were validation errors, the thrown object `error` will have a
      // property called `validationErrors` so that `error.validationErrors`
      // maps backend field names to errors.
      try {
        await resetPassword(uid, token, password)
        console.log(`Password reset.`)
        this.showToast(this.$t('password-reset-successful'), this.$t('you-can-log-in-with-new-password'), 'success')
        const to = this.$route.query.redirect || { name: 'home' }
        this.$router.push(to).catch(() => {})
      } catch(error) {
        error.validationErrors = getValidationErrors(error)
        const errorMessage = error.validationErrors ? this.$t('check-all-fields-valid') : this.$t('unexpected-error')
        this.showToast(this.$t('could-not-reset-password'), errorMessage, 'danger')
        console.error("Resetting password failed:", error)
        throw error
      }
    },

    async requestPasswordReset(email) {
      // Request a password reset for the given email. Throws an error if it failed.
      // If there were validation errors, the thrown object `error` will have a
      // property called `validationErrors` so that `error.validationErrors`
      // maps backend field names to errors.
      try {
        await requestPasswordReset(email)
        console.log(`Requested password reset for ${email}.`)
        this.showToast(this.$t('email-sent'), this.$t('check-your-mailbox'), 'success')
        const to = this.$route.query.redirect || { name: 'home' }
        this.$router.push(to).catch(() => {})
      } catch(error) {
        error.validationErrors = getValidationErrors(error)
        const errorMessage = error.validationErrors ? this.$t('check-all-fields-valid') : this.$t('unexpected-error')
        this.showToast(this.$t('could-not-request-password-reset'), errorMessage, 'danger')
        console.error("Requesting password reset failed:", error)
        throw error
      }
    },

    showToast(title, message, variant) {
      this.$root.$bvToast.toast(message, {
        title,
        variant,
        solid: true,
        toaster: 'b-toaster-bottom-right'
      })
    },
  }
}
