<template>
  <main class="page">
    <PageSiteNav />
    <section class="marquee-page__hero">
      <h1 class="marquee-page__title">{{ $t('marqueePage.title') }}</h1>
      <p class="marquee-page__lead">{{ $t('marqueePage.lead') }}</p>
      <div class="marquee-page__strip marquee-page__strip--dark">
        <MarqueeText
          class="marquee-page__line"
          :text="$t('marqueePage.sampleName')"
          separator=" — "
          :duration="45"
          :repeat="8"
          gap="4rem"
          font-size="clamp(2rem, 7vw, 5rem)"
          font-weight="300"
          letter-spacing="-0.02em"
          color="#f5f5f5"
          :aria-label="$t('marqueePage.ariaLabel')"
        />
      </div>
    </section>
    <section class="marquee-page__section">
      <h2 class="marquee-page__h2">{{ $t('marqueePage.sectionAlt') }}</h2>
      <div class="marquee-page__strip marquee-page__strip--light">
        <MarqueeText
          :text="$t('marqueePage.samplePhrase')"
          separator=" · "
          direction="right"
          :duration="35"
          :repeat="10"
          gap="2.5rem"
          gradient-edges
          fade-width="5rem"
          pause-on-hover
          font-size="clamp(1rem, 2.5vw, 1.35rem)"
          color="#2c3e50"
          :aria-hidden="true"
        />
      </div>
    </section>
  </main>
</template>

<script>
import MarqueeText from "@/components/MarqueeText.vue";
import PageSiteNav from "@/components/PageSiteNav.vue";

export default {
  name: "MarqueePage",
  components: { MarqueeText, PageSiteNav },
};
</script>

<style scoped>
.marquee-page__hero {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding-bottom: 2rem;
}

.marquee-page__title {
  margin: 1.5rem 1rem 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  text-align: center;
}

.marquee-page__lead {
  margin: 0 1rem 1.25rem;
  max-width: 36rem;
  align-self: center;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #5a6b7c;
  text-align: center;
}

.marquee-page__strip {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  box-sizing: border-box;
  padding: 2.25rem 0;
}

.marquee-page__strip--dark {
  background: #0f0f0f;
}

.marquee-page__strip--light {
  background: #eef2f5;
  border-top: 1px solid rgba(44, 62, 80, 0.08);
  border-bottom: 1px solid rgba(44, 62, 80, 0.08);
}

.marquee-page__line {
  font-family: ui-serif, Georgia, serif;
}

.marquee-page__section {
  padding: 0 0 3rem;
}

.marquee-page__h2 {
  margin: 0 1rem 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  text-align: center;
}
</style>
