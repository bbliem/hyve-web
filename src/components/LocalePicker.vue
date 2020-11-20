<template>
  <b-navbar-nav>
    <b-nav-item-dropdown right>
      <template v-slot:button-content>
        <b-icon icon="globe" aria-hidden="true" /> {{ $i18n.locale }}
      </template>
      <b-dropdown-item v-for="locale in locales" :key="locale" @click="setLocale(locale)">
        <span class="selected">{{ locale }} </span>
      </b-dropdown-item>
    </b-nav-item-dropdown>
  </b-navbar-nav>
</template>

<script>
export default {
  data() {
    return {
      locales: this.$i18n.availableLocales
    }
  },
  methods: {
    setLocale(locale) {
      if(this.$i18n.locale !== locale) {
        // Update only 'locale' parameter
        // https://stackoverflow.com/questions/56383717/how-to-replace-one-parameter-in-vuejs-router
        const currentParams = this.$router.currentRoute.params;
        const newParams = { locale }
        const mergedParams = { ...currentParams, ...newParams };
        this.$router.push({ params: mergedParams });
      }
    },
  },
}
</script>

<style lang="scss">
.selected::before {
  position: absolute;
  left: .5rem;
  content: '✓';
}
</style>
