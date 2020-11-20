import { login as storeLogin, logout as storeLogout, state } from '@/store'

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
          if(error.response && error.response.status >= 400 && error.response.status < 500) {
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
      storeLogout()
        .then(() => {
          console.log("Logged out.")
          const personalizedMessage = name ? this.$t('see-you-again-soon-name', { name }) : this.$t('see-you-again-soon')
          this.showToast(this.$t('logged-out'), personalizedMessage, 'info')
          // Ignoring errors because if we are already at the target there will be an error
          this.$router.push({ name: 'home' }).catch(() => {})
        })
    },

    showToast(title, message, variant) {
      this.$root.$bvToast.toast(message, {
        title,
        variant,
        solid: true,
        toaster: 'b-toaster-bottom-right'
      })
    }
  }
}
