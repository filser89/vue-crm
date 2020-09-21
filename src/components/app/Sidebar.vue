<template>
  <ul class="sidenav app-sidenav" :class="{ open: value }">
    <router-link
      tag="li"
      active-class="active"
      v-for="link in links"
      :key="link.url"
      :to="link.url"
      :exact="link.exact"
    >
      <a href="#" class="waves-effect waves-orange pointer">{{ link.title }}</a>
    </router-link>
  </ul>
</template>
<script>
export default {
  props: ["value"],
  data: () => ({
    links: [
      { title: "Account", url: "/", exact: true },
      { title: "Transactions", url: "/detail-record" },
      { title: "Planning", url: "/planning" },
      { title: "New record", url: "/record" },
      { title: "Categories", url: "/categories" },
    ],
  }),
};
</script>
