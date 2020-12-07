<template>
  <div>
    <h1>{{ $t('my-profile') }}</h1>
    <b-form @submit.prevent>
      <div class="avatar-box">
        <b-avatar
          button
          :alt="$t('profile-picture')"
          class="avatar"
          size="8rem"
          :src="avatar"
          variant="info"
          :username="name"
          @click="showFilePicker"
        />
        <b-button variant="light" @click="showFilePicker">
          {{ $t('select-picture') }}
        </b-button>
        <input
          ref="file"
          accept="image/*"
          type="file"
          name="file"
          style="display: none"
          @change="onFileChange($event.target.files)"
        >
      </div>

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

      <p>TODO: Password</p>

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
      avatar: '',
      email: '',
      name: '',
    }
  },
  computed: {
    unsavedChanges() {
      return this.avatar !== state.user.avatar || this.email !== state.user.email || this.name !== state.user.name
    },
  },
  created() {
    this.getDataFromStore()
    window.addEventListener('beforeunload', this.preventNavIfUnsavedChanges)
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.preventNavIfUnsavedChanges)
  },
  beforeRouteLeave(to, from, next) {
    if(!this.preventNavIfUnsavedChanges()) {
      next()
    }
  },
  methods: {
    confirmLeave() {
      return window.confirm(this.$t('discard-unsaved-changes-prompt'))
    },
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
        avatar: this.avatar,
      }, unexpandFields)
      this.getDataFromStore()
      this.$bvToast.toast(this.$t('your-changes-have-been-saved'), {
        title: this.$t('profile-updated'),
        variant: 'success',
        solid: true,
        toaster: 'b-toaster-bottom-right'
      })
    },
    onFileChange(files) {
      try {
        if(files.length !== 1) {
          throw new Error(this.$t('select-only-one-file'))
        }
        const file = files[0]
        if(file.size > this.$appConfig.avatarMaxSize) {
          throw new Error(this.$t('the-file-is-too-large'))
        }
        this.avatarChanged = true
        const fileReader = new FileReader()
        fileReader.onload = (e) => { this.avatar = e.target.result }
        fileReader.readAsDataURL(file)
      } catch(error) {
        this.$bvToast.toast(error.message, {
          title: this.$t('changing-profile-picture-failed'),
          variant: 'danger',
          solid: true,
          toaster: 'b-toaster-bottom-right'
        })
      }
    },
    preventNavIfUnsavedChanges(event) {
      if(this.unsavedChanges && !this.confirmLeave()) {
        if(event) {
          event.preventDefault()
          event.returnValue = ''
        }
        return true
      }
      return false
    },
    showFilePicker() {
      this.$refs.file.click()
    },
    getDataFromStore() {
      this.email = state.user.email
      this.name = state.user.name
      this.avatar = state.user.avatar
    },
  },
}
</script>

<style scoped lang="scss">
.avatar {
  margin: 10px;
}

.avatar-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: space-between;
}
</style>
