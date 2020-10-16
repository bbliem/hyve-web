<template>
  <nav>
    <ContentList v-for="category in categories" :key="category.id" :category="category"/>
  </nav>
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
    }
  },
  mounted: function() {
    // TODO something like:
    // axios.get('endpoint').then(response => this.categories = response{)
    // Dealing with errors etc. is described at https://vuejs.org/v2/cookbook/using-axios-to-consume-apis.html
    this.categories = [
      {
        id: 'cat-1',
        title: 'Cat 1',
      },
      {
        id: 'cat-2',
        title: 'Cat 2',
      },
    ]
  }
}
</script>
