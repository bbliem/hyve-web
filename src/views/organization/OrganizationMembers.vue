<template>
  <div>
    <h1>{{ $t('members') }}</h1>
    <h2>{{ organization.name }}</h2>
    <p>TODO Make sure I'm a supervisor...</p>
  </div>
</template>

<script>
import { state } from '@/store'

export default {
  name: 'OrganizationMembers',
  computed: {
    organization() {
      return state.organization
    },
  },
}
</script>
