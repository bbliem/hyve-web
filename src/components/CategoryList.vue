<template>
  <div class="d-flex flex-wrap">
    <b-card
      v-for="category in categories"
      :key="category.id"
      :img-src="`https://picsum.photos/seed/123${category.id}/600/300/`"
      style="max-width: 25rem"
      class="m-2"
      :title="category.name"
    >
      <b-card-text v-if="category.description">
        {{ category.description }}
      </b-card-text>
      <b-button
        :to="{
          name: 'category-detail',
          params: {
            categoryId: category.id
          }}"
      >
        View category
      </b-button>
    </b-card>
  </div>
</template>

<script>
import { state } from '@/store'

export default {
  name: 'CategoryList',
  computed: {
    categories() { return state.categories }
  }
}
</script>
