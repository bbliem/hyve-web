<template>
  <div>
    <div class="login-form">
      <h1>{{ $t('login') }}</h1>
      <b-form @submit.prevent="login(email, password)">
        <b-form-group
          id="form-group-email"
          :label="$t('email-address-field-label')"
          label-for="email"
        >
          <b-form-input
            id="email"
            v-model="email"
            required
            type="email"
            :placeholder="$t('enter-your-email')"
          />
        </b-form-group>
        <b-form-group
          id="form-group-password"
          :label="$t('password-field-label')"
          label-for="password"
        >
          <b-form-input
            id="password"
            v-model="password"
            required
            type="password"
            :placeholder="$t('enter-your-password')"
          />
        </b-form-group>

        <b-button type="submit" class="mb-3" block>
          {{ $t('login') }}
        </b-button>

        <p class="text-center">
          <a href="#">
            {{ $t('forgot-password') }}
          </a>
        </p>
      </b-form>
    </div>
    <p class="text-center">
      {{ $t('no-account') }}
      <router-link :to="{ name: 'register' }">
        {{ $t('to-registration') }}
      </router-link>
    </p>
  </div>
</template>

<script>
import authenticationMixin from '@/mixins/authenticationMixin'

export default {
  name: 'Login',
  mixins: [authenticationMixin],
  data() {
    return {
      email : '',
      password : '',
    }
  }
}
</script>

<style lang="scss">
.login-form {
  max-width: 340px;
  align: center;
  margin: 20px auto;
}
.login-form form {
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  padding: 20px;
}
.login-form h1 {
  margin: 0 0 15px;
  text-align: center;
}
</style>
