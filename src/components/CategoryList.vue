<template>
  <div class="d-flex flex-wrap">
    <b-card
      v-for="category in categories"
      :key="category.id"
      :img-src="`https://picsum.photos/seed/123${category.id}/400/200/`"
      style="max-width: 25rem"
      class="m-2"
      :title="category.name"
    >
      <!-- eslint-disable-next-line vue/no-v-html -->
      <b-card-text v-if="category.description" v-html="category.description" />
      <b-button
        :to="{
          name: 'category-detail',
          params: {
            categoryId: category.id
          }}"
      >
        {{ $t('view-category') }}
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
