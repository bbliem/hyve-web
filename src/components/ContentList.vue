<template>
  <div>
    <router-link :to="'/' + category.id">{{ category.title }}</router-link>
    <ul v-if="contents.length">
      <li v-for="content in contents" :key="content.id">
        <router-link :to="'/' + category.id + '/' + content.id">{{ content.title }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ContentList',
  props: {
    category: Object,
  },
  data: function() {
    // return serverData.categories[this.categoryId]
    return {
      contents: [],
    }
  },
  mounted: function() {
    // TODO same as in CategoryList
    this.contents = [
      {
        id: 'content-1',
        title: 'Content 1',
      },
      {
        id: 'content-2',
        title: 'Content 2',
      },
    ]
  }
}
</script>
