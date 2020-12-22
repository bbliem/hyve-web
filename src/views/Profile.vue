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

      <!-- At the top of the form, there is a hidden dummy button copying this one. See comment above. When you update this button, also update the dummy SaveButton above. -->
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
      avatar: null,
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
    deleteAvatar() {
      this.avatar = null
    },
    async onSubmit() {
      const unexpandFields = [
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
