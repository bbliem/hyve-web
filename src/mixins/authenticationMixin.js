import axios from 'axios'

import { login as storeLogin, logout as storeLogout, state } from '@/store'

function isClientErrorResponse(response) {
  return response && response.status >= 400 && response.status < 500
}

export default {
  computed: {
    user() { return state.user }
  },
  methods: {
    login(email, password) {
      storeLogin(email, password)
        .then(user => {
          console.log(`Sucessfully logged in as ${user.email}.`)
          const greeting = user.name ? this.$t('welcome-back-name', { name: user.name }) : this.$t('welcome-back')
          this.showToast(this.$t('login-successful'), greeting, 'success')
          // Ignoring errors because if we are already at the target there will be an error
          const to = this.$route.query.redirect || { name: 'home' }
          this.$router.push(to).catch(() => {})
        })
        .catch(error => {
          let errorMessage;
          if(isClientErrorResponse(error.response)) {
            errorMessage = this.$t('check-email-and-password')
          } else {
            errorMessage = this.$t('unexpected-error')
            console.error(error)
          }
          this.showToast(this.$t('login-failed'), errorMessage, 'danger')
          console.error("Login failed.")
        })
    },

    logout() {
      if(state.user) {
        var name = state.user.name
      }
      // Ignoring errors because if we are already at the target there will be an error
      this.$router.push({ name: 'home' }).catch(() => {})
      storeLogout()
        .then(() => {
          console.log("Logged out.")
          const personalizedMessage = name ? this.$t('see-you-again-soon-name', { name }) : this.$t('see-you-again-soon')
          this.showToast(this.$t('logged-out'), personalizedMessage, 'info')
        })
    },

    async register(email, password) {
      // Register the user with the given data, return an object that contains validation errors (empty object if there were none)
      let errorReasons = {}
      const data = { email, password }
      try {
        await axios({ url: this.$appConfig.backendApiUrl + '/auth/users/', data, method: 'POST' })
        console.log(`Registered as ${email}.`)
        await storeLogin(email, password)
        this.showToast(this.$t('registration-successful'), this.$t('welcome'), 'success')
        this.$router.push({ name: 'home' }).catch(() => {})
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
