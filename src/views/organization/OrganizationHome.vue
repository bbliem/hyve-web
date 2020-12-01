<template>
  <div>
    <h1>{{ $t('my-organization') }}</h1>
    <h2>{{ organization.name }}</h2>
    <p>TBT Choose from the sidebar.</p>
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
  name: 'OrganizationHome',
  computed: {
    membership() {
      return state.user.memberships.find(({ organization }) => organization === this.organization.id)
    },
    organization() {
      return state.organization
    },
  },
}
</script>
