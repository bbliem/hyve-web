<template>
  <div class="centered-form">
    <h1>{{ title }}</h1>
    <!--<b-form :model="valid" @submit.prevent="onSubmit">-->
    <!-- What was the :model="..." for? Can't find docs. -->
    <b-form class="mb-3" @submit.prevent="$emit('submit')">
      <slot />
      <b-button
        type="submit"
        class="mb-3"
        block
        :disabled="disableSubmit"
      >
        {{ submitButtonText }}
      </b-button>
      <slot name="after-button" />
    </b-form>
    <slot name="footer" />
  </div>
</template>

<script>
export default {
  name: 'SimpleForm',
  props: {
    title: {
      required: true,
      type: String,
    },
    submitButtonText: {
      required: true,
      type: String,
    },
    disableSubmit: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss">
.centered-form {
  max-width: 340px;
  align: center;
  margin: 20px auto;

  form {
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
    padding: 20px;
  }

  h1 {
    margin: 0 0 15px;
    text-align: center;
  }
}
</style>
