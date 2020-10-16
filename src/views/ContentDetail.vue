<template>
  <div>
    <h1>{{ title }}</h1>
    <p>{{ text }}</p>
  </div>
</template>

<script>
export default {
  name: 'ContentDetail',
  data: function() {
    return {
      title: null,
      text: null,
    }
  },
  mounted: function() {
    // TODO same as in CategoryList
    this.title = `Title of content ${this.$route.params.contentId} in category ${this.$route.params.categoryId}`
    this.text = `Text of content ${this.$route.params.contentId} in category ${this.$route.params.categoryId}`
  }
}
</script>
