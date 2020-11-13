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
          const greeting = user.name ? `Welcome back, ${user.name}!` : "Welcome back!"
          this.showToast("Login successful", greeting, 'success')
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
      if(state.user) {
        var name = state.user.name
      }
      storeLogout()
        .then(() => {
          console.log("Logged out.")
          const personalizedMessage = name ? `See you again soon, ${name}!` : "See you again soon!"
          this.showToast("Logged out", personalizedMessage, 'info')
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
