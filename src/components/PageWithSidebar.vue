<template>
  <div>
    <nav class="sidebar">
      <slot name="sidebar" />
    </nav>
    <main class="content">
      <slot />
    </main>
  </div>
</template>

<script>
export default {
  name: 'PageWithSidebar',
}
</script>

<style lang="scss">
$sidebar-width: 250px;
$large-screen-width: 600px;

.sidebar {
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

    ul {
      list-style-type: none;
      padding: 0;
      margin: 0;
    }

    a {
      display: block;
      font-size: 1.1rem;
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

    .sidebar-headline {
      font-size: 1.5rem;
      font-weight: 700;
    }
  }
}

.content {
  @media screen and (min-width: $large-screen-width) {
    margin-left: $sidebar-width;
  }
}
</style>
