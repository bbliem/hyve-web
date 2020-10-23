<template>
  <b-container>
    <h1>{{ title }}</h1>
    <p>{{ text }}</p>
    <b-btn
      variant="primary"
      @click="showAlert = !showAlert"
    >
      primary foo foo foo foo foo foo
    </b-btn>
    <b-btn variant="secondary">
      secondary foo foo foo foo foo foo
    </b-btn>
    <b-alert :show="showAlert" variant="success">
      You clicked the button!
    </b-alert>
  </b-container>
</template>

<script>
export default {
  name: 'LessonDetail',
  data: function() {
    return {
      title: null,
      text: null,
      showAlert: false
    }
  },
  mounted: function() {
    this.title = `Title of lesson ${this.$route.params.lessonId} in category ${this.$route.params.categoryId}`
    this.text = `Text of lesson ${this.$route.params.lessonId} in category ${this.$route.params.categoryId}`
  }
}
</script>
