<template>
  <div>
    <h1>Learning Material</h1>
    <CategoryList />
  </div>
</template>

<script>
import CategoryList from '../components/CategoryList.vue'

export default {
  name: 'MaterialHome',
  components: {
    CategoryList
  }
}
</script>
