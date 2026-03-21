<template>
  <nav
    class="page-site-nav"
    aria-label="Pages"
  >
    <div
      class="page-site-nav__spacer"
      aria-hidden="true"
    />
    <div
      ref="categoriesRoot"
      class="page-site-nav__categories"
    >
      <div
        v-for="cat in categories"
        :key="cat.id"
        class="page-site-nav__cat"
        :class="{ 'page-site-nav__cat--open': openCategory === cat.id }"
      >
        <button
          type="button"
          class="page-site-nav__cat-trigger"
          :class="{ 'page-site-nav__cat-trigger--active': isCategoryActive(cat) }"
          :aria-expanded="openCategory === cat.id"
          :aria-controls="`site-nav-drawer-${cat.id}`"
          :id="`site-nav-trigger-${cat.id}`"
          @click="toggleCategory(cat.id)"
        >
          {{ $t(cat.i18nKey) }}
        </button>
        <div
          :id="`site-nav-drawer-${cat.id}`"
          class="page-site-nav__subdrawer"
          role="region"
          :aria-labelledby="`site-nav-trigger-${cat.id}`"
          :hidden="openCategory !== cat.id"
        >
          <router-link
            v-for="item in cat.items"
            :key="item.name"
            class="page-site-nav__link"
            :to="{ name: item.name, params: { locale } }"
            @click="closeDrawer"
          >
            {{ $t(item.i18nKey) }}
          </router-link>
        </div>
      </div>
    </div>
    <div class="page-site-nav__end">
      <LanguageFloatButton />
    </div>
  </nav>
</template>

<script>
import LanguageFloatButton from "./LanguageFloatButton.vue";

const NAV_CATEGORIES = [
  {
    id: "home",
    i18nKey: "nav.categoryHome",
    items: [{ name: "Home", i18nKey: "nav.home" }],
  },
  {
    id: "demos",
    i18nKey: "nav.categoryDemos",
    items: [
      { name: "FigamTransferTest", i18nKey: "nav.figamTransferTest" },
      { name: "SkillsPage", i18nKey: "nav.skills" },
      { name: "ArtShowcase", i18nKey: "nav.artShowcase" },
      { name: "WallCalendarDemoPage", i18nKey: "nav.wallCalendarDemo" },
    ],
  },
  {
    id: "components",
    i18nKey: "nav.categoryComponents",
    items: [
      { name: "ComponentRoadmap", i18nKey: "nav.compRoadmap" },
      { name: "ComponentCard", i18nKey: "nav.compCard" },
      { name: "ComponentCarousel", i18nKey: "nav.compCarousel" },
      { name: "WallCalendarPage", i18nKey: "nav.wallCalendar" },
      { name: "BookCalendarPage", i18nKey: "nav.bookCalendar" },
      { name: "NotebookPage", i18nKey: "nav.notebook" },
      { name: "ComponentMarquee", i18nKey: "nav.compMarquee" },
    ],
  },
];

export default {
  name: "PageSiteNav",
  components: { LanguageFloatButton },
  data() {
    return {
      openCategory: null,
    };
  },
  computed: {
    locale() {
      return this.$route.params.locale;
    },
    categories() {
      return NAV_CATEGORIES;
    },
  },
  watch: {
    $route() {
      this.openCategory = null;
    },
  },
  mounted() {
    document.addEventListener("click", this.onDocClick);
    document.addEventListener("keydown", this.onKeydown);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.onDocClick);
    document.removeEventListener("keydown", this.onKeydown);
  },
  methods: {
    isCategoryActive(cat) {
      return cat.items.some((item) => item.name === this.$route.name);
    },
    toggleCategory(id) {
      this.openCategory = this.openCategory === id ? null : id;
    },
    closeDrawer() {
      this.openCategory = null;
    },
    onDocClick(e) {
      const root = this.$refs.categoriesRoot;
      if (root && !root.contains(e.target)) {
        this.openCategory = null;
      }
    },
    onKeydown(e) {
      if (e.key === "Escape") {
        this.openCategory = null;
      }
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

.page-site-nav__categories {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.25rem 0.5rem;
  max-width: 100%;
  position: relative;
}

.page-site-nav__cat {
  position: relative;
}

.page-site-nav__cat-trigger {
  appearance: none;
  margin: 0;
  padding: 0.35rem 0.65rem;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: #2c3e50;
  font: inherit;
  font-weight: 500;
  cursor: pointer;
}

.page-site-nav__cat-trigger:hover {
  text-decoration: underline;
}

.page-site-nav__cat-trigger--active {
  font-weight: 700;
}

.page-site-nav__cat--open .page-site-nav__cat-trigger {
  border-color: rgba(44, 62, 80, 0.2);
  background: rgba(44, 62, 80, 0.04);
}

.page-site-nav__subdrawer {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: calc(100% + 0.35rem);
  min-width: 12rem;
  max-width: min(90vw, 18rem);
  padding: 0.4rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  background: #fff;
  border: 1px solid rgba(44, 62, 80, 0.15);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(44, 62, 80, 0.12);
  z-index: 40;
}

.page-site-nav__subdrawer[hidden] {
  display: none !important;
}

.page-site-nav__end {
  justify-self: end;
  display: flex;
  align-items: center;
}

.page-site-nav__link {
  padding: 0.45rem 0.85rem;
  color: #2c3e50;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
}

.page-site-nav__link:hover {
  background: rgba(44, 62, 80, 0.06);
  text-decoration: none;
}

.page-site-nav__link.router-link-active {
  font-weight: 700;
  background: rgba(44, 62, 80, 0.08);
}
</style>
