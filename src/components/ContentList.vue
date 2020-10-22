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
      {{ category.name }}
    </router-link>
    <ul v-if="category.lessons.length" class="content-list">
      <li v-for="lesson in category.lessons" :key="lesson.id">
        <router-link
          :to="{
            name: 'content-detail',
            params: {
              categoryId: category.id,
              contentId: lesson.id
            }}"
          class="content-link"
        >
          {{ lesson.name }}
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
  }
}
</script>
