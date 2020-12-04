<template>
  <div>
    <h1>{{ $t('my-profile') }}</h1>
    <img src="https://placebeard.it/300/300" alt="$t('profile-picture')">
    <b-form @submit.prevent>
      <b-form-group
        :label="$t('email-address-field-label')"
        label-for="email"
      >
        <b-form-input
          id="email"
          v-model="email"
          type="email"
          required
          :placeholder="$t('enter-your-email')"
        />
      </b-form-group>

      <b-form-group
        :label="$t('name-field-label')"
        label-for="name"
      >
        <b-form-input
          id="name"
          v-model="name"
          required
          :placeholder="$t('enter-your-name')"
        />
      </b-form-group>

      <SaveButton
        type="submit"
        :on-save="onSubmit"
        :disabled="!unsavedChanges"
      />
    </b-form>
  </div>
</template>

<script>
import SaveButton from '@/components/SaveButton'
import { state } from '@/store'

export default {
  name: 'Profile',
  components: {
    SaveButton,
  },
  data() {
    return {
      email: '',
      name: '',
    }
  },
  computed: {
    unsavedChanges() {
      return this.email !== state.user.email || this.name !== state.user.name
    }
  },
  created() {
    this.email = state.user.email
    this.name = state.user.name
  },
  methods: {
    async onSubmit() {
      const unexpandFields = [
        'memberships',
        'multipleChoiceResponses',
        'openQuestionResponses',
        'sectionCompletions',
      ]
      await state.user.updateFieldsAndSave({
        email: this.email,
        name: this.name,
      }, unexpandFields)
      this.$bvToast.toast(this.$t('your-changes-have-been-saved'), {
        title: this.$t('profile-updated'),
        variant: 'success',
        solid: true,
        toaster: 'b-toaster-bottom-right'
      })
    },
  },
}
</script>
