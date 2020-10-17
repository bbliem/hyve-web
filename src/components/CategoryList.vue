<template>
  <div>
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
    }
  },
  mounted: function() {
    // TODO something like:
    // axios.get('endpoint').then(response => this.categories = response{)
    // Dealing with errors etc. is described at https://vuejs.org/v2/cookbook/using-axios-to-consume-apis.html
    this.categories = [
      {
        id: 'mindfulness',
        title: 'Mindfulness',
      },
      {
        id: 'wellbeing',
        title: 'Wellbeing',
      },
    ]
  }
}
</script>
