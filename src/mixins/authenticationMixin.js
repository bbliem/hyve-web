import { login as storeLogin, logout as storeLogout, state } from '@/store'

export default {
  computed: {
    user() { return state.user }
  },
  methods: {
    login(email, password) {
      storeLogin(email, password)
        .then(() => {
          console.log("Sucessfully logged in.")
          this.showToast("Login successful", `You are now logged in.`, 'success')
          // Ignoring errors because if we are already at the target there will be an error
          const to = this.$route.query.redirect || { name: 'home' }
          this.$router.push(to).catch(() => {})
        })
        .catch(error => {
          let errorMessage;
          if(error.response && error.response.status >= 400 && error.response.status < 500) {
            errorMessage = "Please check your e-mail address and password."
          } else {
            errorMessage = "An unexpected error occurred."
            console.error(error)
          }
          this.showToast("Login failed", errorMessage, 'danger')
          console.error(`Login failed.`)
        })
    },

    logout() {
      storeLogout()
        .then(() => {
          console.log("Logged out.")
          this.showToast("Logged out", `You are now logged out.`, 'info')
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
