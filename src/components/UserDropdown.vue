<template>
  <b-navbar-nav>
    <b-nav-item-dropdown v-if="user" right>
      <template v-slot:button-content>
        <b-avatar variant="info" :src="user.avatar" :size="$appConfig.avatarSize" alt="" />
        {{ user.name || user.email }}
      </template>

      <b-dropdown-item :to="{ name: 'profile' }">
        {{ $t('my-profile') }}
      </b-dropdown-item>

      <b-dropdown-item :to="{ name: 'organization-home' }">
        {{ $t('my-organization') }}
      </b-dropdown-item>

      <b-dropdown-item @click="logout">
        {{ $t('logout') }}
      </b-dropdown-item>

      <template v-if="canEdit">
        <b-dropdown-divider />
        <b-dropdown-form>
          <b-form-checkbox v-model="editMode" switch inline>
            {{ $t('edit-mode') }}
          </b-form-checkbox>
        </b-dropdown-form>
      </template>
    </b-nav-item-dropdown>

    <template v-else>
      <b-nav-item :to="{ name: 'login' }">
        {{ $t('login') }}
      </b-nav-item>
      <b-nav-item :to="{ name: 'register' }">
        {{ $t('register') }}
      </b-nav-item>
    </template>
  </b-navbar-nav>
</template>

<script>
import authenticationMixin from '@/mixins/authenticationMixin'
import { setEditMode, state } from '@/store.js'

export default {
  name: 'UserDropdown',
  mixins: [authenticationMixin],
  computed: {
    canEdit() {
      return this.user && this.user.isSuperuser
    },
    editMode: {
      get: function() {
        return state.editMode
      },
      set: function(value) {
        setEditMode(value)
      }
    },
  },
}
</script>
