<template>
  <main class="page">
    <PageSiteNav />
    <section class="section section--hero carousel-page__hero">
      <h1 class="carousel-page__title">{{ $t('carouselPage.title') }}</h1>
      <div class="carousel-page__wrap">
        <CircleCarousel
          class="carousel-page__carousel"
          :items="carouselItems"
          :aria-label="$t('carouselPage.ariaLabel')"
        />
      </div>
    </section>
  </main>
</template>

<script>
import CircleCarousel from "@/components/CircleCarousel.vue";
import PageSiteNav from "@/components/PageSiteNav.vue";
import { demoCarouselItems } from "@/data/demo-carousel-items.js";

export default {
  name: "CarouselPage",
  components: { CircleCarousel, PageSiteNav },
  computed: {
    carouselItems() {
      return demoCarouselItems;
    },
  },
};
</script>

<style scoped>
.carousel-page__hero {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.carousel-page__title {
  margin: 1.5rem 1rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  text-align: center;
}
.carousel-page__wrap {
  width: 100vw;
  max-width: 100vw;
  margin-top: 1.5rem;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  box-sizing: border-box;
  align-self: stretch;
}
.carousel-page__carousel {
  width: 100%;
  max-width: none;
}
</style>
