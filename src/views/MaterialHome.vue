<template>
  <div>
    <h1>{{ $t('learning-material') }}</h1>
    <CategoryList />
  </div>
</template>

<script>
import CategoryList from '../components/CategoryList.vue'

export default {
  name: 'MaterialHome',
  components: {
    CategoryList
  },
  metaInfo() {
    return { title: this.$t('learning-material') }
  },
}
</script>
