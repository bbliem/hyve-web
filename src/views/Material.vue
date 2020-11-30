<template>
  <FetchedContent :fetch="fetch" :error-message="$t('could-not-load-categories')">
    <!-- v-slot="{}" is a hack to wait with rendering the content until fetching is done -->
    <template v-slot="{}">
      <nav id="sidebar">
        <MaterialSidebar :active-category-id="activeCategoryId" :categories="categories" :lessons="lessons" />
      </nav>

      <main id="content">
        <router-view
          :key="$route.path"
          :categories="categories"
          :lessons="lessons"
        />
      </main>
    </template>
  </FetchedContent>
</template>

<script>
import Category from '@/models/Category'
import FetchedContent from '@/components/FetchedContent'
import MaterialSidebar from '@/components/MaterialSidebar'
import { state } from '@/store'

export default {
  name: 'Material',
  components: {
    FetchedContent,
    MaterialSidebar,
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

<style lang="scss">
$sidebar-width: 250px;
$large-screen-width: 600px;

#sidebar {
  display: none;

  @media screen and (min-width: $large-screen-width) {
    display: block;
    position: fixed; // Fixed sidebar (stay in place on scroll)
    overflow-y: auto;
    height: 100%;
    width: $sidebar-width;

    margin: 0;
    padding: 10px;
    /*overflow-x: hidden; [> Disable horizontal scroll <]*/

    ul.lesson-list {
      list-style-type: none;
      padding: 0;
      margin: 0;
    }

    a {
      display: block;
      padding: 16px;
      color: $shadow;
      border-left: .25rem solid transparent;
      transition: background-color .3s ease;
      padding: .35rem 1.5rem .35rem 1.25rem;

      &:hover {
        background: $cultured;
        text-decoration: none;
      }

      &.router-link-active {
        border-left-color: $shadow;
      }
    }

    .category-link {
      font-size: 1.5rem;
      font-weight: 700;
    }

    .lesson-link {
      font-size: 1.1rem;
    }
  }
}

#content {
  @media screen and (min-width: $large-screen-width) {
    margin-left: $sidebar-width;
  }
}
</style>
