<template>
  <b-card no-body class="card">
    <b-button v-b-toggle.collapse-editor variant="light" block class="text-left">
      <span class="when-closed">
        <b-icon icon="chevron-down" aria-hidden="true" /> {{ textShow }}
      </span>
      <span class="when-open">
        <b-icon icon="chevron-up" aria-hidden="true" /> {{ textHide }}
      </span>
    </b-button>
    <b-collapse id="collapse-editor">
      <b-card-body>
        <slot />
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
export default {
  name: 'CollapsibleCard',
  props: {
    textShow: {
      type: String,
      required: true,
    },
    textHide: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.card {
  max-width: 50rem;
  margin: 0.5rem 0 0.5rem 0;
}
</style>
