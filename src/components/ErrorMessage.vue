<template>
  <b-alert variant="danger" show>
    Error: {{ message }}
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
