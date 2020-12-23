import { login, logout, register } from '@/auth'
import { fetchUser, resetUser } from '@/store'

function isClientErrorResponse(response) {
  return response && response.status >= 400 && response.status < 500
}

export default {
  computed: {
    user() { return this.$state.user }
  },
  methods: {
    async login(email, password) {
      try {
        const userId = await login(email, password)
        await fetchUser(userId)
        console.log(`Sucessfully logged in as user ${this.$state.user.name}.`)
        const greeting = this.$state.user.name ? this.$t('welcome-back-name', { name: this.$state.user.name }) : this.$t('welcome-back')
        this.showToast(this.$t('login-successful'), greeting, 'success')
        // Ignoring errors because if we are already at the target there will be an error
        const to = this.$route.query.redirect || { name: 'home' }
        this.$router.push(to).catch(() => {})
      } catch(error) {
        let errorMessage;
        if(error.response && isClientErrorResponse(error.response)) {
          errorMessage = this.$t('check-email-and-password')
        } else {
          errorMessage = this.$t('unexpected-error')
          console.error(error)
        }
        this.showToast(this.$t('login-failed'), errorMessage, 'danger')
        console.error("Login failed.")
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

    async register(email, password) {
      // Register the user with the given data, return an object that contains validation errors (empty object if there were none)
      let errorReasons = {}
      try {
        await register(email, password)
        console.log(`Registered as ${email}.`)
        const userId = await login(email, password)
        await fetchUser(userId)
        this.showToast(this.$t('registration-successful'), this.$t('welcome'), 'success')
        const to = this.$route.query.redirect || { name: 'home' }
        this.$router.push(to).catch(() => {})
      } catch(error) {
        let errorMessage;
        if(isClientErrorResponse(error.response)) {
          // error.response.data is (hopefully) an object mapping a field name to an explanation why there was a validation error with that field
          errorReasons = error.response.data
          errorMessage = this.$t('check-all-fields-valid')
          console.error(error)
        } else {
          errorMessage = this.$t('unexpected-error')
          console.error(error)
        }
        this.showToast(this.$t('registration-failed'), errorMessage, 'danger')
        console.error("Registration failed.")
      }
      return errorReasons
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
