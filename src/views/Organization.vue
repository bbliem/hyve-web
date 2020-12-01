<template>
  <div v-if="organization && user">
    <PageWithSidebar>
      <template #sidebar>
        <router-link class="sidebar-headline" :to="{ name: 'organization-home' }">
          {{ $t('my-organization') }}
        </router-link>
        <router-link :to="{ name: 'organization-profile' }">
          {{ $t('organization-profile') }}
        </router-link>
        <router-link :to="{ name: 'organization-members' }">
          {{ $t('members') }}
        </router-link>
      </template>

      <router-view :key="$route.path" />
    </PageWithSidebar>
  </div>
</template>

<script>
import PageWithSidebar from '@/components/PageWithSidebar'
import { state } from '@/store'

export default {
  name: 'Organization',
  components: {
    PageWithSidebar,
  },
  computed: {
    organization() {
      return state.organization
    },
    user() {
      return state.user
    },
  },
}
</script>
