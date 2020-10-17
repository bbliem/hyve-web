<template>
  <div id="app">
    <NavBar brand-name="Unnamed Learning Platform" />

    <div id="page">
      <!--<router-view :key="$route.fullPath" />-->
      <router-view />
    </div>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'

export default {
  components: {
    NavBar
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
