<template>
  <div class="wall-calendar-demo">
    <div class="demo-scroll-container" ref="scrollContainer">
      <div class="demo-sticky-wrapper" ref="stickyWrapper">
        <WallCalendarPage
          :disable-interaction="true"
          :external-progress="scrollProgress"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import WallCalendarPage from "./WallCalendarPage.vue";

gsap.registerPlugin(ScrollTrigger);

export default {
  name: "WallCalendarDemoPage",
  components: {
    WallCalendarPage,
  },
  setup() {
    const scrollContainer = ref(null);
    const stickyWrapper = ref(null);
    const scrollProgress = ref(0);
    let scrollTriggerInstance = null;

    onMounted(() => {
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: scrollContainer.value,
        pin: stickyWrapper.value,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          scrollProgress.value = self.progress;
        },
      });
    });

    onBeforeUnmount(() => {
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }
    });

    return {
      scrollContainer,
      stickyWrapper,
      scrollProgress,
    };
  },
};
</script>

<style scoped>
.wall-calendar-demo {
  position: relative;
  width: 100%;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.wall-calendar-demo::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.wall-calendar-demo {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.demo-scroll-container {
  /* Height determines how long the user needs to scroll. 
     6 pages = 5 transitions. 800vh gives a good scroll duration with pauses. */
  height: 800vh;
  position: relative;
}

.demo-sticky-wrapper {
  width: 100%;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
}
</style>
