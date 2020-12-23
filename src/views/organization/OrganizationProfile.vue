<template>
  <div>
    <h1>{{ $t('organization-profile') }}</h1>
    <h2>{{ organization.name }}</h2>
  </div>
</template>

<script>
export default {
  name: 'OrganizationProfile',
  computed: {
    organization() {
      return this.$state.organization
    },
  },
}
</script>
