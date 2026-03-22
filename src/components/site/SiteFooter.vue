<template>
  <footer
    class="site-footer"
    role="contentinfo"
  >
    <div class="site-footer__inner">
      <nav
        class="site-footer__nav"
        :aria-label="$t('footer.navAria')"
      >
        <router-link
          class="site-footer__link"
          :to="{ name: 'Home', params: { locale: localeSegment } }"
        >
          {{ $t('nav.home') }}
        </router-link>
        <a
          class="site-footer__link"
          :href="`mailto:${$t('home.contact.email')}`"
        >
          {{ $t('home.contact.emailLabel') }}
        </a>
        <a
          class="site-footer__link"
          href="https://www.behance.net/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ $t('home.contact.behance') }}
        </a>
        <a
          class="site-footer__link"
          href="https://www.linkedin.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ $t('home.contact.linkedin') }}
        </a>
      </nav>
      <p class="site-footer__rights">
        {{ $t('footer.rights', { year }) }}
      </p>
    </div>
  </footer>
</template>

<script>
import { pathFromLocale } from '../../router'
import { defaultLocale } from '../../i18n'

export default {
  name: "SiteFooter",
  computed: {
    localeSegment() {
      return this.$route.params.locale ?? pathFromLocale(defaultLocale)
    },
    year() {
      return new Date().getFullYear();
    },
  },
};
</script>

<style scoped>
.site-footer {
  flex-shrink: 0;
  margin-top: auto;
  padding: 0.65rem max(1rem, env(safe-area-inset-left)) 0.75rem
    max(1rem, env(safe-area-inset-right));
  background: #ffffff;
  border-top: 1px solid rgb(255, 255, 255);
}

.site-footer__inner {
  max-width: 72rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  text-align: center;
}

.site-footer__nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.35rem 0.65rem;
}

.site-footer__link {
  color: #ffffff00;
  font-weight: 500;
  font-size: 0.8125rem;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: color 0.15s ease, border-color 0.15s ease;
}

.site-footer__link:hover {
  color: #3d4f5f;
  border-bottom-color: rgba(61, 79, 95, 0.3);
}

.site-footer__link.router-link-active {
  color: #4a5a68;
  border-bottom-color: rgba(74, 90, 104, 0.35);
}

.site-footer__rights {
  margin: 0;
  font-size: 0.6875rem;
  color: #9ca8b3;
}
</style>
