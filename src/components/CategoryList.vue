<template>
  <div>
    <b-skeleton-table v-if="loading" :rows="3" :columns="1" :table-props="{ borderless: true }" />
    <b-alert v-if="error" variant="danger" show>
      {{ error }}
    </b-alert>
    <ContentList v-for="category in categories" :key="category.id" :category="category" />
  </div>
</template>

<script>
import ContentList from './ContentList.vue'

export default {
  name: 'CategoryList',
  components: {
    ContentList
  },
  data: function() {
    return {
      categories: [],
      error: null,
      loading: false,
    }
  },
  created: function() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.categories = []
      this.error = null
      this.loading = true
      fetch(this.$appConfig.backendApiUrl + this.$appConfig.endpointCategory)
        .then(response => response.json())
        .then(json => {
          this.categories = json.map(category => ({
            id: category.id,
            title: category.name,
            contents: category.lessons.map(lesson =>({
              id: lesson.id,
              title: lesson.name,
            })),
          }))
        })
        .catch(error => {
          this.error = 'Could not load categories: ' + error
          console.error(this.error)
        })
        .finally(() => this.loading = false)
    }
  }
}
</script>
