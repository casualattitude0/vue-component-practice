<template>
  <main class="page">
    <PageSiteNav />
    <section class="section section--hero skills-page__hero">
      <h1 class="skills-page__title">{{ $t('skillsPage.title') }}</h1>
      <div class="skills-page__wrap">
        <CircleCarousel
          class="skills-page__carousel"
          :items="carouselItems"
          :aria-label="$t('skillsPage.ariaLabel')"
        />
      </div>
    </section>
  </main>
</template>

<script>
import CircleCarousel from "@/components/CircleCarousel.vue";
import PageSiteNav from "@/components/PageSiteNav.vue";

export default {
  name: "SkillsPage",
  components: { CircleCarousel, PageSiteNav },
  computed: {
    carouselItems() {
      // Use keys to map over the skills
      const skillKeys = [0, 1, 2, 3, 4];
      return skillKeys.map((index) => ({
        src: `https://picsum.photos/seed/skill${index}/400/400`,
        alt: this.$t(`skillsPage.skills.${index}.label`),
        label: this.$t(`skillsPage.skills.${index}.label`),
        info: this.$t(`skillsPage.skills.${index}.info`)
      }));
    },
  },
};
</script>

<style scoped>
.skills-page__hero {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.skills-page__title {
  margin: 1.5rem 1rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  text-align: center;
}
.skills-page__wrap {
  width: 100vw;
  max-width: 100vw;
  margin-top: 1.5rem;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  box-sizing: border-box;
  align-self: stretch;
}
.skills-page__carousel {
  width: 100%;
  max-width: none;
}
</style>
