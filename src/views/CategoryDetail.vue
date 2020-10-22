<template>
  <div>
    <b-skeleton-table v-if="loading" :rows="3" :columns="1" :table-props="{ borderless: true }" />
    <b-alert v-if="error" variant="danger" show>
      {{ error }}
    </b-alert>
    <section v-if="category">
      <h1>{{ category.name }}</h1>
      <p>{{ category.description }}</p>
      <h2>Lessons in this category</h2>
      <ul>
        <li v-for="lesson in category.lessons" :key="lesson.id">
          <router-link :to="'/' + categoryId + '/' + lesson.id">
            {{ lesson.name }}
          </router-link>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import Category from '@/models/Category'
import fetchMixin from '@/mixins/fetchMixin'

export default {
  name: 'CategoryDetail',
  mixins: [fetchMixin],
  props: {
    categoryId: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      category: null
    }
  },
  created: function() {
    this.loading = true
    Category
      .include('lessons')
      .params({omit: 'lessons.contents'})
      .find(this.categoryId)
      .then(category => {
        this.category = category
      })
      .catch(error => {
        this.error = 'Could not load category'
        console.error(error)
      })
      .finally(() => this.loading = false)
  }
}
</script>
