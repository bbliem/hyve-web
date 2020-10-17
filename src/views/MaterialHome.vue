<template>
  <div>
    <p>This is the place for all learning material. Choose a category or content.</p>
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
