<template>
  <b-navbar toggleable="sm" type="dark" variant="info" sticky>
    <b-navbar-brand :to="{ name: 'home' }">
      {{ brandName }}
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse" />

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item :to="{ name: 'material-home' }">
          {{ $t('material') }}
        </b-nav-item>
        <!-- TODO create about page and link here-->
        <b-nav-item :to="{ name: 'about' }">
          {{ $t('about') }}
        </b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <LocalePicker class="ml-auto" />

      <b-navbar-nav>
        <template v-if="initialized">
          <b-nav-item-dropdown v-if="user" right>
            <template v-slot:button-content>
              <b-avatar variant="info" src="https://placebeard.it/300/300" alt="" />
              {{ user.name || user.email }}
            </template>
            <b-dropdown-item href="#">
              {{ $t('my-profile') }}
            </b-dropdown-item>
            <b-dropdown-item @click="logout">
              {{ $t('logout') }}
            </b-dropdown-item>
          </b-nav-item-dropdown>
          <template v-else>
            <b-nav-item :to="{ name: 'login' }">
              {{ $t('login') }}
            </b-nav-item>
            <b-nav-item>{{ $t('register') }}</b-nav-item>
          </template>
        </template>
        <b-spinner v-else variant="secondary" />
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import authenticationMixin from '@/mixins/authenticationMixin'
import { state } from '@/store.js'
import LocalePicker from './LocalePicker'

export default {
  name: 'NavBar',
  components: {
    LocalePicker,
  },
  mixins: [authenticationMixin],
  props: {
    brandName: {
      type: String,
      required: true
    }
  },
  computed: {
    initialized() { return state.initialized }
  },
}
</script>
