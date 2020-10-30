<template>
  <div>
    <nav id="sidebar">
      <MaterialSidebar />
    </nav>

    <main id="content">
      <router-view :key="$route.fullPath" />
    </main>
  </div>
</template>

<script>
import MaterialSidebar from '@/components/MaterialSidebar.vue'

export default {
  name: 'Material',
  components: {
    MaterialSidebar
  }
}
</script>

<style lang="scss">
$sidebar-width: 250px;
$large-screen-width: 600px;

#sidebar {
  @media screen and (min-width: $large-screen-width) {
    position: fixed; // Fixed sidebar (stay in place on scroll)
    height: 100%;
    width: $sidebar-width;
  }
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

#content {
  @media screen and (min-width: $large-screen-width) {
    margin-left: $sidebar-width;
  }
}
</style>
