<template>
  <b-alert variant="danger" show>
    {{ $t('error', { msg: message }) }}
  </b-alert>
</template>

<script>
export default {
  name: 'ErrorMessage',
  props: {
    message: {
      type: String,
      required: true
    }
  }
}
</script>
