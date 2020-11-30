<template>
  <div v-if="organization && user">
    <h1>TODO My Organization</h1>
    <h2>{{ organization.name }}</h2>
    <p v-if="membership.isSupervisor">
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
  name: 'Organization',
  computed: {
    membership() {
      return state.user.memberships.find(({ organization }) => organization === this.organization.id)
    },
    organization() {
      return state.organization
    },
    user() {
      return state.user
    },
  },
}
</script>
