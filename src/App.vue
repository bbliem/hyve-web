<template>
  <div id="app">
    <NavBar :brand-name="title" :logo-url="logoUrl" :logo-height="$appConfig.logoHeight" />

    <b-container id="page" fluid="lg">
      <!-- If global state is loading or has an error, show this here. -->
      <b-overlay :show="fetching" variant="white" no-wrap />
      <ErrorMessage v-if="error" :message="error" />
      <router-view :key="$route.name" />
    </b-container>
  </div>
</template>

<script>
import ErrorMessage from './components/ErrorMessage.vue'
import NavBar from './components/NavBar.vue'

export default {
  components: {
    ErrorMessage,
    NavBar,
  },
  data() {
    return {
      title: this.$appConfig.appTitle,
    }
  },
  computed: {
    error() { return this.$state.error },
    fetching() { return this.$state.fetching },
    logoUrl() {
      const c = this.$appConfig
      return c.showLogo ? `${c.mediaUrl}/logos/${c.organization}${c.logoExtension}` : ''
    },
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
