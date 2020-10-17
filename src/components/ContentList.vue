<template>
  <div>
    <router-link
      :to="{
        name: 'category-detail',
        params: {
          categoryId: category.id
        }
      }"
      class="category-link"
    >
      {{ category.title }}
    </router-link>
    <ul v-if="contents.length" class="content-list">
      <li v-for="content in contents" :key="content.id">
        <router-link
          :to="{
            name: 'content-detail',
            params: {
              categoryId: category.id,
              contentId: content.id
            }}"
          class="content-link"
        >
          {{ content.title }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ContentList',
  props: {
    category: {
      type: Object,
      required: true
    }
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
