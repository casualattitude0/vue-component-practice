<template>
  <nav
    class="page-site-nav"
    aria-label="Pages"
  >
    <router-link
      v-for="item in items"
      :key="item.name"
      class="page-site-nav__link"
      :to="{ name: item.name, params: { locale } }"
    >
      {{ $t(item.i18nKey) }}
    </router-link>
  </nav>
</template>

<script>
const NAV_ITEMS = [
  { name: "Home", i18nKey: "nav.home" },
  { name: "Roadmap", i18nKey: "nav.roadmap" },
  { name: "FigamTransferTest", i18nKey: "nav.figamTransferTest" },
  { name: "CardDemo", i18nKey: "nav.cardDemo" },
  { name: "CarouselPage", i18nKey: "nav.carousel" },
];

export default {
  name: "PageSiteNav",
  computed: {
    locale() {
      return this.$route.params.locale;
    },
    items() {
      return NAV_ITEMS;
    },
  },
};
</script>

<style scoped>
.page-site-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 1.5rem;
  justify-content: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid rgba(44, 62, 80, 0.12);
}
.page-site-nav__link {
  color: #2c3e50;
  font-weight: 500;
  text-decoration: none;
}
.page-site-nav__link:hover {
  text-decoration: underline;
}
.page-site-nav__link.router-link-active {
  font-weight: 700;
}
</style>
