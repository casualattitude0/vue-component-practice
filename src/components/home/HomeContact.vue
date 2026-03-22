<template>
  <footer
    ref="root"
    class="home-contact"
    role="contentinfo"
  >
    <h2 class="home-contact__title">
      {{ $t('home.contact.title') }}
    </h2>
    <p class="home-contact__tagline">
      {{ $t('home.contact.tagline') }}
    </p>
    <div class="home-contact__links">
      <a
        class="home-contact__link"
        :href="`mailto:${$t('home.contact.email')}`"
      >
        {{ $t('home.contact.emailLabel') }}
      </a>
      <span
        class="home-contact__sep"
        aria-hidden="true"
      >·</span>
      <a
        class="home-contact__link"
        href="https://www.behance.net/"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ $t('home.contact.behance') }}
      </a>
      <span
        class="home-contact__sep"
        aria-hidden="true"
      >·</span>
      <a
        class="home-contact__link"
        href="https://www.linkedin.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ $t('home.contact.linkedin') }}
      </a>
    </div>
    <p class="home-contact__rights">
      {{ $t('home.contact.rights', { year: year }) }}
    </p>
  </footer>
</template>

<script>
export default {
  name: "HomeContact",
  computed: {
    year() {
      return new Date().getFullYear();
    },
  },
};
</script>

<style scoped>
.home-contact {
  padding: 1rem max(1rem, env(safe-area-inset-left)) 1.1rem
    max(1rem, env(safe-area-inset-right));
  text-align: center;
  max-width: 48rem;
  margin: 0 auto;
}

.home-contact__title {
  margin: 0 0 0.25rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #666;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.home-contact__tagline {
  margin: 0 0 0.65rem;
  line-height: 1.45;
  color: #555;
  font-size: 0.8125rem;
}

.home-contact__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.35rem 0.5rem;
  margin-bottom: 0.55rem;
}

.home-contact__sep {
  color: #999;
  font-weight: 400;
  user-select: none;
}

.home-contact__link {
  color: #333;
  font-weight: 500;
  font-size: 0.8125rem;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: color 0.15s ease, border-color 0.15s ease;
}

.home-contact__link:hover {
  color: #000;
  border-bottom-color: #666;
}

.home-contact__rights {
  margin: 0;
  font-size: 0.6875rem;
  color: #888;
}
</style>
