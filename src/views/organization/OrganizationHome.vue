<template>
  <div>
    <h1>{{ $t('my-organization') }}</h1>
    <h2>{{ organization.name }}</h2>
    <p>TBT Choose from the sidebar.</p>
    <p v-if="user.isSupervisor">
      I'm a supervisor!
    </p>
    <p v-else>
      I'm not a supervisor.
    </p>
  </div>
</template>

<script>
import { state } from '@/store'

export default {
  name: 'OrganizationHome',
  computed: {
    user() {
      return state.user
    },
    organization() {
      return state.organization
    },
  },
}
</script>
