<template>
  <main class="card-demo">
    <nav
      class="card-demo__nav"
      aria-label="Pages"
    >
      <router-link
        class="card-demo__link"
        :to="{ name: 'Home', params: { locale } }"
      >
        {{ $t('cardDemo.navHome') }}
      </router-link>
    </nav>

    <header class="card-demo__header">
      <h1 class="card-demo__title">{{ $t('cardDemo.title') }}</h1>
    </header>

    <section class="card-demo__section">
      <h2 class="card-demo__h2">{{ $t('cardDemo.hoverSection') }}</h2>
      <div class="card-demo__grid">
        <div class="card-demo__cell">
          <p class="card-demo__label">{{ $t('cardDemo.labelScaleDown') }}</p>
          <CustomCard
            class="card-demo__shell"
            hover-effect="scale-down"
            :hover-scale="0.92"
            :hover-transition-ms="280"
            media-position="top"
          >
            <template #image>
              <img
                :src="imgA"
                alt=""
              />
            </template>
            <h3 class="card-demo__card-title">{{ $t('cardDemo.cardTitle') }}</h3>
            <p class="card-demo__card-text">{{ $t('cardDemo.cardHint') }}</p>
          </CustomCard>
        </div>
        <div class="card-demo__cell">
          <p class="card-demo__label">{{ $t('cardDemo.labelRotation') }}</p>
          <CustomCard
            class="card-demo__shell"
            hover-effect="rotation"
            :hover-rotate-deg="6"
            media-position="top"
          >
            <template #image>
              <img
                :src="imgB"
                alt=""
              />
            </template>
            <h3 class="card-demo__card-title">{{ $t('cardDemo.cardTitle') }}</h3>
            <p class="card-demo__card-text">{{ $t('cardDemo.cardHint') }}</p>
          </CustomCard>
        </div>
      </div>
    </section>

    <section class="card-demo__section">
      <h2 class="card-demo__h2">{{ $t('cardDemo.layoutSection') }}</h2>
      <div class="card-demo__grid card-demo__grid--four">
        <div class="card-demo__cell">
          <p class="card-demo__label">{{ $t('cardDemo.labelTop') }}</p>
          <CustomCard
            class="card-demo__shell"
            hover-effect="scale-down"
            media-position="top"
            text-align="center"
          >
            <template #image>
              <img
                :src="imgC"
                alt=""
              />
            </template>
            <p class="card-demo__card-text">{{ $t('cardDemo.layoutBlurb') }}</p>
          </CustomCard>
        </div>
        <div class="card-demo__cell">
          <p class="card-demo__label">{{ $t('cardDemo.labelBottom') }}</p>
          <CustomCard
            class="card-demo__shell"
            hover-effect="rotation"
            :hover-rotate-deg="-5"
            media-position="bottom"
            text-align="center"
          >
            <template #image>
              <img
                :src="imgC"
                alt=""
              />
            </template>
            <p class="card-demo__card-text">{{ $t('cardDemo.layoutBlurb') }}</p>
          </CustomCard>
        </div>
        <div class="card-demo__cell">
          <p class="card-demo__label">{{ $t('cardDemo.labelLeft') }}</p>
          <CustomCard
            class="card-demo__shell card-demo__shell--row"
            hover-effect="scale-down"
            :hover-scale="0.95"
            media-position="left"
            media-align="center"
          >
            <template #image>
              <img
                class="card-demo__thumb"
                :src="imgD"
                alt=""
              />
            </template>
            <p class="card-demo__card-text">{{ $t('cardDemo.layoutBlurbShort') }}</p>
          </CustomCard>
        </div>
        <div class="card-demo__cell">
          <p class="card-demo__label">{{ $t('cardDemo.labelRight') }}</p>
          <CustomCard
            class="card-demo__shell card-demo__shell--row"
            hover-effect="rotation"
            :hover-rotate-deg="4"
            media-position="right"
            media-align="center"
          >
            <template #image>
              <img
                class="card-demo__thumb"
                :src="imgD"
                alt=""
              />
            </template>
            <p class="card-demo__card-text">{{ $t('cardDemo.layoutBlurbShort') }}</p>
          </CustomCard>
        </div>
      </div>
    </section>

    <section class="card-demo__section">
      <h2 class="card-demo__h2">{{ $t('cardDemo.tuningSection') }}</h2>
      <div class="card-demo__grid">
        <div class="card-demo__cell">
          <p class="card-demo__label">{{ $t('cardDemo.labelCoverCrop') }}</p>
          <CustomCard
            class="card-demo__shell card-demo__shell--crop"
            hover-effect="scale-down"
            media-position="top"
            media-image-object-fit="cover"
            media-image-object-position="center 20%"
          >
            <template #image>
              <img
                :src="imgA"
                alt=""
              />
            </template>
            <p class="card-demo__card-text">{{ $t('cardDemo.tuningBlurb') }}</p>
          </CustomCard>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import CustomCard from "@/components/CustomCard.vue";
import imgA from "@/assets/Cookie_Ginger_Brave_default.png";
import imgB from "@/assets/Cookie_Pomegranate_default.png";
import imgC from "@/assets/Cookie_Licorice_default.png";
import imgD from "@/assets/Cookie_Poison_Mushroom_default.png";

export default {
  name: "CardDemoPage",
  components: { CustomCard },
  computed: {
    locale() {
      return this.$route.params.locale;
    },
  },
  data() {
    return { imgA, imgB, imgC, imgD };
  },
};
</script>

<style scoped>
.card-demo {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1.5rem 3rem;
  color: #2c3e50;
}
.card-demo__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 1.5rem;
  justify-content: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(44, 62, 80, 0.12);
  margin-bottom: 1.5rem;
}
.card-demo__link {
  color: #2c3e50;
  font-weight: 500;
  text-decoration: none;
}
.card-demo__link:hover {
  text-decoration: underline;
}
.card-demo__header {
  text-align: center;
  margin-bottom: 2rem;
}
.card-demo__title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
}
.card-demo__section {
  margin-bottom: 2.75rem;
}
.card-demo__h2 {
  margin: 0 0 1rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: rgba(44, 62, 80, 0.85);
}
.card-demo__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}
.card-demo__grid--four {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
.card-demo__label {
  margin: 0 0 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: rgba(44, 62, 80, 0.55);
}
.card-demo__shell {
  padding: 1rem;
  border-radius: 12px;
  background: #fff;
  border: 1px solid rgba(44, 62, 80, 0.12);
  box-shadow: 0 8px 24px rgba(44, 62, 80, 0.06);
}
.card-demo__shell--row :deep(.custom-card__media) {
  width: 88px;
  flex-shrink: 0;
}
.card-demo__shell--row :deep(.custom-card__media img) {
  max-height: 88px;
  width: auto;
  object-fit: contain;
}
.card-demo__thumb {
  max-height: 88px;
  width: auto;
}
.card-demo__shell--crop :deep(.custom-card__media) {
  height: 140px;
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
}
.card-demo__card-title {
  margin: 0.75rem 0 0.25rem;
  font-size: 1.05rem;
}
.card-demo__card-text {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.45;
  color: rgba(44, 62, 80, 0.78);
}
</style>
