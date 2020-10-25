<template>
  <ul v-if="category.lessons.length" class="lesson-list">
    <li v-for="lesson in category.lessons" :key="lesson.id">
      <router-link
        :to="{
          name: 'lesson-detail',
          params: {
            categoryId: category.id,
            lessonId: lesson.id
          }}"
        class="lesson-link"
      >
        {{ lesson.name }}
        <b-badge v-if="lesson.id === 1" pill variant="success" style="float: right">
          &checkmark;
        </b-badge>
      </router-link>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'LessonList',
  props: {
    category: {
      type: Object,
      required: true
    }
  }
}
</script>
