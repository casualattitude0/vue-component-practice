<template>
  <main class="page">
    <nav
      class="home-nav"
      aria-label="Pages"
    >
      <router-link
        class="home-nav__link"
        :to="{ name: 'Home', params: { locale } }"
      >
        {{ $t('nav.home') }}
      </router-link>
      <router-link
        class="home-nav__link"
        :to="{ name: 'Roadmap', params: { locale } }"
      >
        {{ $t('nav.roadmap') }}
      </router-link>
      <router-link
        class="home-nav__link"
        :to="{ name: 'FigamTransferTest', params: { locale } }"
      >
        {{ $t('nav.figamTransferTest') }}
      </router-link>
      <router-link
        class="home-nav__link"
        :to="{ name: 'CardDemo', params: { locale } }"
      >
        {{ $t('nav.cardDemo') }}
      </router-link>
      <router-link
        class="home-nav__link"
        :to="{ name: 'CarouselPage', params: { locale } }"
      >
        {{ $t('nav.carousel') }}
      </router-link>
    </nav>
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
import { demoCarouselItems } from "@/data/demo-carousel-items.js";

export default {
  name: "CarouselPage",
  components: { CircleCarousel },
  computed: {
    locale() {
      return this.$route.params.locale;
    },
    carouselItems() {
      return demoCarouselItems;
    },
  },
};
</script>

<style scoped>
.home-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 1.5rem;
  justify-content: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid rgba(44, 62, 80, 0.12);
}
.home-nav__link {
  color: #2c3e50;
  font-weight: 500;
  text-decoration: none;
}
.home-nav__link:hover {
  text-decoration: underline;
}
.home-nav__link.router-link-active {
  font-weight: 700;
}
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
