<template>
  <div class="home-page">
    <div class="home-page__curtain">
      <!-- <PageSiteNav /> -->
      <HomeHero />
      <HomeAbout />
      <HomeSkills />
      <HomeExperience />
      <HomeProjects />
      <div class="home-page__contact">
        <HomeContact />
      </div>
    </div>
  </div>
</template>

<script>
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
// import PageSiteNav from "../components/PageSiteNav.vue";
import HomeHero from "../components/home/HomeHero.vue";
import HomeAbout from "../components/home/HomeAbout.vue";
import HomeSkills from "../components/home/HomeSkills.vue";
import HomeExperience from "../components/home/HomeExperience.vue";
import HomeProjects from "../components/home/HomeProjects.vue";
import HomeContact from "../components/home/HomeContact.vue";
import { createLenisScroll } from "../utils/lenisGsap";

gsap.registerPlugin(ScrollTrigger);

export default {
  name: "HomePage",
  components: {
    // PageSiteNav,
    HomeHero,
    HomeAbout,
    HomeSkills,
    HomeExperience,
    HomeProjects,
    HomeContact,
  },
  provide() {
    return {
      homeLenisScrollTo: (id) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (this.lenisInstance) {
          this.lenisInstance.scrollTo(el, { offset: -68, lerp: 0.12 });
        } else {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      },
    };
  },
  data() {
    return {
      lenisInstance: null,
      disposeLenis: null,
    };
  },
  mounted() {
    const { destroy, lenis } = createLenisScroll();
    this.disposeLenis = destroy;
    this.lenisInstance = lenis;
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  },
  beforeUnmount() {
    if (this.disposeLenis) {
      this.disposeLenis();
      this.disposeLenis = null;
    }
    this.lenisInstance = null;
  },
};
</script>

<style scoped>
.home-page {
  position: relative;
  min-height: 100vh;
}

.home-page__curtain {
  position: relative;
  z-index: 1;
  background: #fff;
  box-shadow: 0 clamp(12px, 3vw, 40px) clamp(40px, 6vw, 100px)
    rgba(0, 0, 0, 0.08);
}

.home-page__contact {
  position: relative;
  z-index: 1;
  border-top: 1px solid #ccc;
  background: #f5f5f5;
}
</style>
