<template>
  <!-- If you use this component, consider wrapping its content in
    <template v-slot="{}">...</template>
    See https://stackoverflow.com/a/50761804/14595546 -->
  <div>
    <div v-if="loading" class="text-center">
      <b-spinner />
    </div>
    <slot v-if="success" />
    <ErrorMessage v-if="error" :message="error" />
  </div>
</template>

<script>
import ErrorMessage from '@/components/ErrorMessage'

export default {
  name: 'FetchedContent',
  components: {
    ErrorMessage,
  },
  props: {
    fetch: {
      type: Function,
      required: true
    },
    errorMessage: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      error: null,
      loading: true,
      success: false,
    }
  },
  async created() {
    try {
      await this.fetch()
      this.success = true
    } catch(error) {
      this.error = this.errorMessage
      console.error(this.error, error)
    } finally {
      this.loading = false
    }
  },
}
</script>
