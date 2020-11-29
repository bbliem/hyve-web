<template>
  <div>
    <h1>{{ $t('learning-material') }}</h1>
    <CategoryList :categories="categories" />
  </div>
</template>

<script>
import CategoryList from '@/components/CategoryList'

export default {
  name: 'MaterialHome',
  components: {
    CategoryList,
  },
  props: {
    categories: {
      type: Array,
      required: true
    },
  },
  metaInfo() {
    return { title: this.$t('learning-material') }
  },
}
</script>
