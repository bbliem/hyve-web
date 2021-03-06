<template>
  <div>
    <h1>{{ $t('my-profile') }}</h1>
    <b-form @submit.prevent>
      <!-- The following is a hidden dummy button. If it were not here, the first button occurring in the form would be treated as the submit button (when the user presses enter). When you update this one, also update the SaveButton below. See https://stackoverflow.com/questions/1963245/multiple-submit-buttons-on-html-form-designate-one-button-as-default -->
      <SaveButton
        class="dummy-save-button"
        type="submit"
        :on-save="onSubmit"
        :disabled="!unsavedChanges"
      />

      <div class="avatar-box">
        <b-avatar
          button
          badge-variant="danger"
          badge-top
          :alt="$t('profile-picture')"
          class="avatar"
          size="16rem"
          :src="avatar"
          :title="$t('select-profile-picture')"
          variant="info"
          :username="name"
          @click="showFilePicker"
        >
          <template v-if="avatar" #badge>
            <button class="text-button">
              <b-icon
                icon="trash"
                :title="$t('delete-profile-picture')"
                @click.stop="deleteAvatar"
              />
            </button>
          </template>
        </b-avatar>
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
        :state="emailState"
        :invalid-feedback="emailInvalidFeedback"
      >
        <b-form-input
          id="email"
          v-model="email"
          type="email"
          required
          :placeholder="$t('enter-your-email')"
          :state="emailState"
          @input="emailValidationError = null"
        />
      </b-form-group>

      <b-form-group
        :label="$t('name-field-label')"
        label-for="name"
        :state="nameState"
        :invalid-feedback="nameInvalidFeedback"
      >
        <b-form-input
          id="name"
          v-model="name"
          :placeholder="$t('enter-your-name')"
          :state="nameState"
          @input="nameValidationError = null"
        />
      </b-form-group>

      <!-- At the top of the form, there is a hidden dummy button copying this one. See comment above. When you update this button, also update the dummy SaveButton above. -->
      <SaveButton
        type="submit"
        :on-save="onSubmit"
        :disabled="!unsavedChanges"
      />
    </b-form>

    <p class="mt-3">
      <router-link :to="{ name: 'change-password' }">
        {{ $t('change-password') }}
      </router-link>
    </p>

    <b-button variant="danger" class="mt-3" @click="onDelete">
      {{ $t('delete-account') }}
    </b-button>
  </div>
</template>

<script>
import SaveButton from '@/components/SaveButton'
import authenticationMixin from '@/mixins/authenticationMixin'
import { clearCredentials } from '@/auth'
import { resetUser } from '@/store'

export default {
  name: 'Profile',
  components: {
    SaveButton,
  },
  mixins: [authenticationMixin],
  data() {
    return {
      avatar: null,
      email: '',
      emailValidationError: null,
      name: '',
      nameValidationError: null,
    }
  },
  computed: {
    emailInvalidFeedback() {
      return this.emailValidationError || this.$t('email-address-invalid')
    },
    emailState() {
      if(this.emailValidationError) {
        return false
      }
      return this.email ? true : null
    },
    nameInvalidFeedback() {
      return this.nameValidationError || this.$t('value-invalid')
    },
    nameState() {
      if(this.nameValidationError) {
        return false
      }
      return this.name ? true : null
    },
    unsavedChanges() {
      return this.avatar !== this.$state.user.avatar || this.email !== this.$state.user.email || this.name !== this.$state.user.name
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
    deleteAvatar() {
      this.avatar = null
    },
    async onDelete() {
      const response = await this.$bvModal.msgBoxConfirm(this.$t('really-delete-account'), {
        title: this.$t('are-you-sure'),
        okVariant: 'danger',
        okTitle: this.$t('yes'),
        cancelTitle: this.$t('no'),
      })
      if(response) {
        this.$router.push({ name: 'home' })
        // FIXME This doesn't work like that. Need to use DELETE to /auth/users/me/ (or whatever the new endpoint is) with current_password in payload.
        this.$state.user.delete()
        resetUser()
        clearCredentials()
      }
    },
    async onSubmit() {
      try {
        await this.updateProfile(this.email, this.name, this.avatar)
        this.emailValidationError = null
        this.nameValidationError = null
        this.getDataFromStore()
      } catch(error) {
        this.emailValidationError = error.validationErrors.email ? error.validationErrors.email[0] : null
        this.nameValidationError = error.validationErrors.name ? error.validationErrors.name[0] : null
      }
    },
    onFileChange(files) {
      try {
        if(files.length !== 1) {
          throw new Error(this.$t('select-only-one-file'))
        }
        const file = files[0]
        if(file.size > this.$appConfig.avatarMaxFileSize) {
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
      this.email = this.$state.user.email
      this.name = this.$state.user.name
      this.avatar = this.$state.user.avatar
    },
  },
}
</script>

<style scoped lang="scss">
.avatar {
  margin: 10px;
  /* Unfortunately bootstrap-vue doesn't allow us to set the avatar badge size */
  ::v-deep & > .b-avatar-badge {
    font-size: 2rem !important;
  }
}

.avatar-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: space-between;
}

.text-button {
  background: none;
  border: none;
  color: inherit;
  cursor: auto;
  padding: 0;
  z-index: 9999;
}

.dummy-save-button {
   position: absolute;
   left: -100%;
}
</style>
