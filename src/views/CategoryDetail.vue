<template>
  <div>
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
    <h2>Contents in this category</h2>
    <ul>
      <li v-for="content in contents" :key="content.id">
        <router-link :to="'/' + $route.params.categoryId + '/' + content.id">
          {{ content.title }}
        </router-link>
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
  created: function() {
    const id = this.$route.params.categoryId
    fetch(this.$appConfig.backendApiUrl + this.$appConfig.endpointCategory + `/${id}/`)
      .then(response => response.json())
      .then(json => {
        this.title = json.name
        this.description = json.description
        this.contents = [
          {
            id: 'todo1',
            title: 'Placeholder content 1'
          },
          {
            id: 'todo-2',
            title: 'Placeholder content 2'
          }
        ]
      })
      .catch(error => {
        this.error = 'Could not load category: ' + error
        console.error(this.error)
      })
      .finally(() => this.loading = false)
  }
}
</script>
