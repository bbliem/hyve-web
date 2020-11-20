<template>
  <router-link :to="getTo()">
    <slot />
  </router-link>
</template>

<script>
export default {
  props: {
    to: {
      type: [String, Object],
      required: true,
    },
  },
  methods: {
    getTo() {
      const locale = this.$i18n.locale
      if(typeof this.to === 'string') {
        // Strip leading and trailing slashes and prefix the current locale
        return `/${locale}/${this.to.replace(/^\/|\/$/g, '')}`
      }
      // Assume we're given an Object, otherwise something's probably wrong anyway.
      const newTo = {...this.to}
      newTo.params = {...newTo.params, ...{ locale }}
      return newTo
    }
  }
}
</script>
