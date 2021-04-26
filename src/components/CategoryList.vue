<template>
  <div class="d-flex flex-wrap">
    <b-card
      v-for="category in categories"
      :key="category.id"
      :img-src="category.imgSrc"
      :img-width="category.image && category.image.width"
      :img-height="category.image && category.image.height"
      style="max-width: 25rem"
      class="m-2"
      :title="category.title"
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
export default {
  name: 'CategoryList',
  props: {
    categories: {
      type: Array,
      required: true
    },
  },
}
</script>
