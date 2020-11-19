<template>
  <div id="app">
    <NavBar :brand-name="title" />

    <div id="page">
      <!-- If global state is loading or has an error, show this here. -->
      <b-overlay :show="fetchingMaterial" variant="white" no-wrap />
      <ErrorMessage v-if="error" :message="error" />
      <router-view v-else :key="$route.fullPath" />
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
    NavBar,
  },
  data() {
    return {
      title: this.$appConfig.appTitle
    }
  },
  computed: {
    fetchingMaterial() { return state.fetchingMaterial },
    error() { return state.error },
  },
  metaInfo() {
    return {
      titleTemplate: titleChunk => {
        return titleChunk ? `${titleChunk} | ${this.$appConfig.appTitle}` : this.$appConfig.appTitle;
      }
    }
  },
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,400;0,700;1,400;1,700&display=swap');

#app {
  font-family: 'Raleway', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#page {
  padding: 15px;
}
</style>
