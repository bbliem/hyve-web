<template>
  <b-navbar toggleable="sm" type="dark" variant="info" sticky>
    <b-container fluid="lg">
      <b-navbar-brand :to="{ name: 'home' }">
        <img v-if="logoUrl" :src="logoUrl" :alt="brandName" :height="logoHeight">
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse" />

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item :to="{ name: 'material-home' }">
            {{ $t('material') }}
          </b-nav-item>

          <!-- Static pages defined in environment -->
          <b-nav-item v-for="page in $appConfig.staticPages" :key="page.path" :to="{ name: page.name }">
            {{ page.title[$i18n.locale] }}
          </b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <!-- dummy to make all following items aligned right -->
        <div class="ml-auto" />

        <LocalePicker />

        <UserDropdown v-if="initialized" />
        <b-navbar-nav v-else>
          <b-spinner variant="secondary" />
        </b-navbar-nav>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
import LocalePicker from './LocalePicker'
import UserDropdown from './UserDropdown'

export default {
  name: 'NavBar',
  components: {
    LocalePicker,
    UserDropdown,
  },
  props: {
    brandName: {
      type: String,
      required: true
    },
    logoHeight: {
      type: Number,
      default: null
    },
    logoUrl: {
      type: String,
      default: ''
    },
  },
  computed: {
    initialized() {
      return this.$state.initialized
    },
  },
}
</script>
