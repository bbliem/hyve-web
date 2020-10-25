<template>
  <div id="app">
    <NavBar :brand-name="title" />

    <div id="page">
      <!-- If global state is loading or has an error, show this here. -->
      <b-overlay :show="loading" variant="white" no-wrap />
      <ErrorMessage v-if="error" :message="error" />
      <router-view v-else />
    </div>
  </div>
</template>

<script>
import ErrorMessage from './components/ErrorMessage.vue'
import NavBar from './components/NavBar.vue'
import { state } from '@/store'

export default {
  components: {
    ErrorMessage,
    NavBar
  },
  data() {
    return {
      title: this.$appConfig.appTitle
    }
  },
  computed: {
    loading() { return state.loading },
    error() { return state.error },
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Raleway&display=swap');

#app {
  font-family: 'Raleway', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#page {
  padding: 15px;
}
</style>
