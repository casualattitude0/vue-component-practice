<template>
  <nav
    class="page-site-nav"
    aria-label="Pages"
  >
    <div
      class="page-site-nav__spacer"
      aria-hidden="true"
    />
    <div class="page-site-nav__links">
      <router-link
        v-for="item in items"
        :key="item.name"
        class="page-site-nav__link"
        :to="{ name: item.name, params: { locale } }"
      >
        {{ $t(item.i18nKey) }}
      </router-link>
    </div>
    <div class="page-site-nav__end">
      <LanguageFloatButton />
    </div>
  </nav>
</template>

<script>
import LanguageFloatButton from "./LanguageFloatButton.vue";

const NAV_ITEMS = [
  { name: "Home", i18nKey: "nav.home" },
  { name: "Roadmap", i18nKey: "nav.roadmap" },
  { name: "FigamTransferTest", i18nKey: "nav.figamTransferTest" },
  { name: "CardDemo", i18nKey: "nav.cardDemo" },
  { name: "CarouselPage", i18nKey: "nav.carousel" },
  { name: "SkillsPage", i18nKey: "nav.skills" },
  { name: "ArtShowcase", i18nKey: "nav.artShowcase" },
  { name: "NotebookPage", i18nKey: "nav.notebook" },
];

export default {
  name: "PageSiteNav",
  components: { LanguageFloatButton },
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
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 0.75rem 1rem;
  padding: 1rem max(1rem, env(safe-area-inset-left)) 1rem
    max(1rem, env(safe-area-inset-right));
  border-bottom: 1px solid rgba(44, 62, 80, 0.12);
}

.page-site-nav__spacer {
  min-width: 0;
}

.page-site-nav__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem 1.5rem;
  max-width: 100%;
}

.page-site-nav__end {
  justify-self: end;
  display: flex;
  align-items: center;
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
