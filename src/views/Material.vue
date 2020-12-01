<template>
  <FetchedContent :fetch="fetch" :error-message="$t('could-not-load-categories')">
    <!-- v-slot="{}" is a hack to wait with rendering the content until fetching is done -->
    <template v-slot="{}">
      <PageWithSidebar>
        <template #sidebar>
          <MaterialSidebar :active-category-id="activeCategoryId" :categories="categories" :lessons="lessons" />
        </template>

        <router-view
          :key="$route.path"
          :categories="categories"
          :lessons="lessons"
        />
      </PageWithSidebar>
    </template>
  </FetchedContent>
</template>

<script>
import Category from '@/models/Category'
import FetchedContent from '@/components/FetchedContent'
import PageWithSidebar from '@/components/PageWithSidebar'
import MaterialSidebar from '@/components/MaterialSidebar'
import { state } from '@/store'

export default {
  name: 'Material',
  components: {
    FetchedContent,
    MaterialSidebar,
    PageWithSidebar,
  },
  props: {
    activeCategoryId: {
      type: Number,
      default: undefined,
    },
  },
  data() {
    return {
      categories: null,
    }
  },
  computed: {
    lessons() {
      return state.organization.lessons
    },
  },
  methods: {
    async fetch() {
      this.categories = await Category.get()
    },
  },
}
</script>
