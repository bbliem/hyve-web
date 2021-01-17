<template>
  <FetchedContent :fetch="fetch" :error-message="$t('could-not-load-organization')">
    <!-- v-slot="{}" is a hack to wait with rendering the content until fetching is done -->
    <template v-slot="{}">
      <h1>{{ $t('my-organization') }}</h1>
      <p v-if="user.isSupervisor || user.isSuperuser">
        {{ $t('organization-page-instructions-for-supervisor') }}
      </p>
      <p v-else>
        {{ $t('organization-page-instructions-for-non-supervisor') }}
      </p>
      <b-list-group style="max-width: 500px;">
        <b-list-group-item v-for="member in members" :key="member.id" class="d-flex align-items-center">
          <b-avatar class="mr-3" :src="member.avatar" />
          <a :href="`mailto:${member.email}`" class="mr-auto">
            <span v-if="member.name" :title="member.email">{{ member.name }}</span>
            <span v-else class="mr-auto">{{ member.email }}</span>
          </a>
          <b-badge v-if="member.isSupervisor">
            Supervisor
          </b-badge>
          <!--
          <b-button
            v-else
            variant="danger"
            size="sm"
            :title="$t('delete-user')"
            @click="onDeleteUser"
          >
            <b-icon icon="dash-circle" />
          </b-button>
          -->
        </b-list-group-item>
      </b-list-group>
    </template>
  </FetchedContent>
</template>

<script>
import Organization from '@/models/Organization'
import FetchedContent from '@/components/FetchedContent'

export default {
  name: 'Organization',
  components: {
    FetchedContent,
  },
  data() {
    return {
      organization: null,
    }
  },
  computed: {
    user() {
      return this.$state.user
    },
    members() {
      return this.organization.users
    },
  },
  methods: {
    async fetch() {
      this.organization = await Organization
        .include('users')
        .find(this.$state.organization.id)
    },
  },
}
</script>
