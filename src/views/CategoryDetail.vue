<template>
	<div>
		<h1>{{ title }}</h1>
		<p>{{ description }}</p>
		<h2>Contents in this category</h2>
		<ul>
			<li v-for="content in contents" :key="content.id">
				<router-link :to="'/' + $route.params.categoryId + '/' + content.id">{{ content.title }}</router-link>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
  name: 'CategoryDetail',
  data: function() {
    return {
      title: null,
      description: null,
      contents: []
    }
  },
  mounted: function() {
    // TODO same as in CategoryList
    this.title = `Title of category ${this.$route.params.categoryId}`
    this.description = `Description of category ${this.$route.params.categoryId}`
    this.contents = [
      {
        id: 'content-1',
        title: 'Content 1'
      },
      {
        id: 'content-2',
        title: 'Content 2'
      }
    ]
  }
}
</script>
