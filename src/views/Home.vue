<template>
  <main class="page homepage">
    <header class="homepage__header">
      <div class="announcement">
        <p class="announcement__text">
          Sign up and get 20% off to your first order.
          <a href="#" class="announcement__link">Sign Up Now</a>
        </p>
        <button type="button" class="announcement__close" aria-label="Close">
          <img :src="icons.close" alt="" class="h-5 w-5" />
        </button>
      </div>
      <div class="nav-bar">
        <div class="nav-bar__logo">SHOP.CO</div>
        <nav class="nav-bar__links">
          <a href="#">Shop</a>
          <a href="#">On Sale</a>
          <a href="#">New Arrivals</a>
          <a href="#">Brands</a>
        </nav>
        <div class="nav-bar__search">
          <img :src="icons.search" alt="" class="h-6 w-6 shrink-0" />
          <span class="text-black/40">Search for products...</span>
        </div>
        <div class="nav-bar__actions">
          <img :src="icons.cart" alt="Cart" class="h-6 w-6" />
          <img :src="icons.user" alt="Account" class="h-6 w-6" />
        </div>
      </div>
    </header>

    <section class="hero">
      <div class="hero__bg" />
      <div class="hero__inner">
        <div class="hero__content">
          <h1 class="hero__title">FIND CLOTHES THAT MATCHES YOUR STYLE</h1>
          <p class="hero__desc">
            Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
          </p>
          <button type="button" class="hero__cta">Shop Now</button>
          <div class="hero__stats">
            <div class="hero__stat">
              <span class="hero__stat-num">200+</span>
              <span class="hero__stat-label">International Brands</span>
            </div>
            <div class="hero__stat-divider" />
            <div class="hero__stat">
              <span class="hero__stat-num">2,000+</span>
              <span class="hero__stat-label">High-Quality Products</span>
            </div>
            <div class="hero__stat-divider" />
            <div class="hero__stat">
              <span class="hero__stat-num">30,000+</span>
              <span class="hero__stat-label">Happy Customers</span>
            </div>
          </div>
        </div>
        <div class="hero__image-wrap">
          <img :src="heroModels" alt="" class="hero__image" />
        </div>
      </div>
    </section>

    <section class="brands">
      <div class="brands__inner">
        <img v-for="(logo, i) in brandLogoList" :key="i" :src="logo" :alt="'Brand ' + (i + 1)" class="brands__logo" />
      </div>
    </section>

    <section class="section products">
      <h2 class="section__heading">NEW ARRIVALS</h2>
      <div class="products__grid">
        <article v-for="(product, i) in newArrivalsProducts" :key="i" class="product-card">
          <div class="product-card__image-wrap">
            <img :src="product.img" :alt="product.name" class="product-card__image" />
          </div>
          <div class="product-card__stars">★ 4.5/5</div>
          <h3 class="product-card__name">{{ product.name }}</h3>
          <div class="product-card__price">
            <span class="product-card__price-current">{{ product.price }}</span>
            <template v-if="product.original">
              <span class="product-card__price-old">{{ product.original }}</span>
              <span class="product-card__badge">{{ product.badge }}</span>
            </template>
          </div>
        </article>
      </div>
      <button type="button" class="section__btn">View All</button>
    </section>

    <section class="section products">
      <h2 class="section__heading">TOP SELLING</h2>
      <div class="products__grid">
        <article v-for="(product, i) in topSellingProducts" :key="i" class="product-card">
          <div class="product-card__image-wrap">
            <img :src="product.img" :alt="product.name" class="product-card__image" />
          </div>
          <div class="product-card__stars">{{ product.rating }}/5</div>
          <h3 class="product-card__name">{{ product.name }}</h3>
          <div class="product-card__price">
            <span class="product-card__price-current">{{ product.price }}</span>
            <template v-if="product.original">
              <span class="product-card__price-old">{{ product.original }}</span>
              <span class="product-card__badge">{{ product.badge }}</span>
            </template>
          </div>
        </article>
      </div>
      <button type="button" class="section__btn">View All</button>
    </section>

    <section class="section dress-styles">
      <h2 class="section__heading dress-styles__heading">BROWSE BY DRESS STYLE</h2>
      <div class="dress-styles__grid">
        <div v-for="style in dressStyles" :key="style.name" class="dress-style-card">
          <img :src="style.img" :alt="style.name" class="dress-style-card__image" />
          <span class="dress-style-card__label">{{ style.name }}</span>
        </div>
      </div>
    </section>

    <section class="section testimonials">
      <h2 class="section__heading">OUR HAPPY CUSTOMERS</h2>
      <div class="testimonials__wrap">
        <button type="button" class="testimonials__arrow" aria-label="Previous">
          <img :src="icons.arrowLeft" alt="" class="h-6 w-6 rotate-90" />
        </button>
        <div class="testimonials__grid">
          <article v-for="t in testimonials" :key="t.name" class="testimonial-card">
            <div class="testimonial-card__stars">★★★★★</div>
            <h3 class="testimonial-card__name">{{ t.name }}</h3>
            <p class="testimonial-card__text">{{ t.text }}</p>
          </article>
        </div>
        <button type="button" class="testimonials__arrow" aria-label="Next">
          <img :src="icons.arrowRight" alt="" class="h-6 w-6 -rotate-90" />
        </button>
      </div>
    </section>

    <section class="newsletter">
      <div class="newsletter__inner">
        <h2 class="newsletter__title">STAY UPTO DATE ABOUT OUR LATEST OFFERS</h2>
        <div class="newsletter__form">
          <div class="newsletter__input-wrap">
            <img :src="icons.mail" alt="" class="h-6 w-6 shrink-0" />
            <input type="email" placeholder="Enter your email address" class="newsletter__input" />
          </div>
          <button type="button" class="newsletter__submit">Subscribe to Newsletter</button>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="footer__inner">
        <div class="footer__brand">
          <div class="footer__logo">SHOP.CO</div>
          <p class="footer__desc">
            We have clothes that suits your style and which you're proud to wear. From women to men.
          </p>
          <div class="footer__social">
            <a v-for="s in socialLinks" :key="s.name" :href="s.href" :aria-label="s.name" class="footer__social-link" />
          </div>
        </div>
        <div class="footer__columns">
          <div class="footer__col">
            <h4 class="footer__col-title">COMPANY</h4>
            <a href="#">About</a><a href="#">Features</a><a href="#">Works</a><a href="#">Career</a>
          </div>
          <div class="footer__col">
            <h4 class="footer__col-title">HELP</h4>
            <a href="#">Customer Support</a><a href="#">Delivery Details</a><a href="#">Terms & Conditions</a><a href="#">Privacy Policy</a>
          </div>
          <div class="footer__col">
            <h4 class="footer__col-title">FAQ</h4>
            <a href="#">Account</a><a href="#">Manage Deliveries</a><a href="#">Orders</a><a href="#">Payments</a>
          </div>
          <div class="footer__col">
            <h4 class="footer__col-title">RESOURCES</h4>
            <a href="#">Free eBooks</a><a href="#">Development Tutorial</a><a href="#">How to - Blog</a><a href="#">Youtube Playlist</a>
          </div>
        </div>
      </div>
      <div class="footer__bottom">
        <p class="footer__copy">Shop.co © 2000-2023, All Rights Reserved</p>
        <div class="footer__payments">
          <img v-for="(badge, i) in paymentBadges" :key="i" :src="badge" alt="" class="footer__payment-badge" />
        </div>
      </div>
    </footer>
  </main>
</template>

<script>
import {
  heroModels,
  newArrivals as newArrivalsImgs,
  topSelling as topSellingImgs,
  dressStyles,
  icons,
  brandLogos,
  paymentBadges,
} from '../assets/homepage-images.js'

const brandLogoList = [
  brandLogos.versace,
  brandLogos.zara,
  brandLogos.gucci,
  brandLogos.prada,
  brandLogos.calvinKlein,
]

const newArrivalsProducts = [
  { name: 'T-shirt with Tape Details', img: newArrivalsImgs[0], price: '$120' },
  { name: 'Skinny Fit Jeans', img: newArrivalsImgs[1], price: '$240', original: '$260', badge: '-20%' },
  { name: 'Checkered Shirt', img: newArrivalsImgs[2], price: '$180' },
  { name: 'Sleeve Striped T-shirt', img: newArrivalsImgs[3], price: '$130', original: '$160', badge: '-30%' },
]

const topSellingProducts = [
  { name: 'Vertical Striped Shirt', img: topSellingImgs[0], price: '$212', original: '$232', badge: '-20%', rating: '5.0' },
  { name: 'Courage Graphic T-shirt', img: topSellingImgs[1], price: '$145', rating: '4.0' },
  { name: 'Loose Fit Bermuda Shorts', img: topSellingImgs[2], price: '$80', rating: '3.0' },
  { name: 'Faded Skinny Jeans', img: topSellingImgs[3], price: '$210', rating: '4.5' },
]

const testimonials = [
  { name: 'Sarah M.', text: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations." },
  { name: 'Alex K.', text: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions." },
  { name: 'James L.', text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends." },
]

const socialLinks = [
  { name: 'Twitter', href: '#' },
  { name: 'Facebook', href: '#' },
  { name: 'Instagram', href: '#' },
  { name: 'TikTok', href: '#' },
]

export default {
  name: 'HomePage',
  data() {
    return {
      heroModels,
      dressStyles,
      icons,
      brandLogoList,
      newArrivalsProducts,
      topSellingProducts,
      testimonials,
      socialLinks,
      paymentBadges,
    }
  },
}
</script>

<style scoped>
.homepage {
  background: #fff;
}

.announcement {
  background: #000;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  position: relative;
  font-size: 14px;
}
.announcement__link { text-decoration: underline; }
.announcement__close {
  position: absolute;
  right: 1.25rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
}

.nav-bar {
  max-width: 1440px;
  margin: 0 auto;
  padding: 1rem 6.25rem;
  display: flex;
  align-items: center;
  gap: 2.5rem;
}
.nav-bar__logo {
  font-weight: 700;
  font-size: 2rem;
  letter-spacing: -0.02em;
}
.nav-bar__links {
  display: flex;
  gap: 1.5rem;
  font-size: 1rem;
}
.nav-bar__links a { color: #000; text-decoration: none; }
.nav-bar__search {
  flex: 1;
  max-width: 36rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #f0f0f0;
  border-radius: 62px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
}
.nav-bar__actions { display: flex; gap: 0.875rem; }

.hero {
  position: relative;
  min-height: 663px;
  background: #f2f0f1;
  overflow: hidden;
}
.hero__bg {
  position: absolute;
  inset: 0;
  background: #f2f0f1;
}
.hero__inner {
  position: relative;
  max-width: 1440px;
  margin: 0 auto;
  padding: 4rem 6.25rem 6rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
}
.hero__content { max-width: 577px; }
.hero__title {
  font-weight: 700;
  font-size: clamp(2rem, 4vw, 4rem);
  line-height: 1;
  letter-spacing: -0.02em;
  margin: 0 0 1rem;
}
.hero__desc {
  font-size: 1rem;
  line-height: 1.375;
  color: rgba(0,0,0,0.6);
  margin: 0 0 1.5rem;
}
.hero__cta {
  background: #000;
  color: #fff;
  border: none;
  border-radius: 62px;
  padding: 1rem 3.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 2rem;
}
.hero__stats {
  display: flex;
  align-items: center;
  gap: 2rem;
}
.hero__stat { display: flex; flex-direction: column; }
.hero__stat-num { font-weight: 700; font-size: 2.5rem; }
.hero__stat-label { font-size: 1rem; color: rgba(0,0,0,0.6); }
.hero__stat-divider {
  width: 1px;
  height: 74px;
  background: rgba(0,0,0,0.15);
}
.hero__image-wrap {
  flex-shrink: 0;
  width: min(46.66%, 672px);
}
.hero__image { width: 100%; height: auto; object-fit: contain; object-position: right bottom; }

.brands {
  background: #000;
  padding: 2rem 6.25rem;
}
.brands__inner {
  max-width: 1240px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
}
.brands__logo { height: 2rem; width: auto; object-fit: contain; filter: brightness(0) invert(1); }

.section {
  max-width: 1240px;
  margin: 0 auto;
  padding: 4rem 6.25rem;
}
.section__heading {
  font-weight: 700;
  font-size: 3rem;
  text-align: center;
  margin: 0 0 3rem;
  letter-spacing: -0.02em;
}
.section__btn {
  display: block;
  margin: 2rem auto 0;
  padding: 1rem 3.375rem;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 62px;
  background: #fff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
}

.products__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}
.product-card { text-align: left; }
.product-card__image-wrap {
  background: #f0eeed;
  border-radius: 20px;
  height: 298px;
  overflow: hidden;
  margin-bottom: 1rem;
}
.product-card__image { width: 100%; height: 100%; object-fit: cover; object-position: center top; }
.product-card__stars { font-size: 0.875rem; color: rgba(0,0,0,0.6); margin-bottom: 0.25rem; }
.product-card__name { font-weight: 700; font-size: 1.25rem; margin: 0 0 0.5rem; }
.product-card__price { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
.product-card__price-current { font-weight: 700; font-size: 1.5rem; }
.product-card__price-old { font-size: 1.5rem; color: rgba(0,0,0,0.4); text-decoration: line-through; }
.product-card__badge {
  background: rgba(255,51,51,0.1);
  color: #f33;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.375rem 0.875rem;
  border-radius: 62px;
}

.dress-styles { padding-bottom: 4rem; }
.dress-styles__heading { margin-bottom: 2rem; }
.dress-styles__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 289px);
  gap: 1.5rem;
}
.dress-styles__grid .dress-style-card:nth-child(1) { grid-column: 1; grid-row: 1; }
.dress-styles__grid .dress-style-card:nth-child(2) { grid-column: 2 / 4; grid-row: 1; }
.dress-styles__grid .dress-style-card:nth-child(3) { grid-column: 1 / 3; grid-row: 2; }
.dress-styles__grid .dress-style-card:nth-child(4) { grid-column: 3 / 5; grid-row: 2; }
.dress-style-card {
  position: relative;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
}
.dress-style-card__image { width: 100%; height: 100%; object-fit: cover; }
.dress-style-card__label {
  position: absolute;
  left: 2.25rem;
  top: 50%;
  transform: translateY(-50%);
  font-weight: 700;
  font-size: 2.25rem;
}

.testimonials__wrap {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.testimonials__arrow {
  flex-shrink: 0;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
}
.testimonials__grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
.testimonial-card {
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 20px;
  padding: 1.75rem 2rem;
  text-align: left;
}
.testimonial-card__stars { color: #f79e1b; margin-bottom: 0.5rem; font-size: 1rem; }
.testimonial-card__name { font-weight: 700; font-size: 1.25rem; margin: 0 0 0.5rem; }
.testimonial-card__text { font-size: 1rem; line-height: 1.375; color: rgba(0,0,0,0.6); margin: 0; }

.newsletter {
  background: #000;
  margin: 0 6.25rem 4rem;
  padding: 2.25rem 4rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
}
.newsletter__title {
  font-weight: 700;
  font-size: 2.5rem;
  line-height: 1.125;
  color: #fff;
  margin: 0;
  max-width: 551px;
}
.newsletter__form { display: flex; flex-direction: column; gap: 0.875rem; }
.newsletter__input-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #fff;
  border-radius: 62px;
  padding: 0.75rem 1rem;
  width: 349px;
}
.newsletter__input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
}
.newsletter__input::placeholder { color: rgba(0,0,0,0.4); }
.newsletter__submit {
  background: #fff;
  color: #000;
  border: none;
  border-radius: 62px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  width: 349px;
}

.footer {
  background: #f0f0f0;
  padding: 4rem 6.25rem 2rem;
}
.footer__inner {
  max-width: 1240px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  gap: 4rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid rgba(0,0,0,0.1);
}
.footer__brand { max-width: 248px; }
.footer__logo { font-weight: 700; font-size: 2rem; letter-spacing: -0.02em; margin-bottom: 1rem; }
.footer__desc { font-size: 0.875rem; line-height: 1.57; color: rgba(0,0,0,0.6); margin: 0 0 1.5rem; }
.footer__social { display: flex; gap: 2.5rem; }
.footer__social-link {
  width: 28px;
  height: 28px;
  background: #d6dce5;
  border-radius: 50%;
}
.footer__columns { display: flex; gap: 4rem; }
.footer__col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 1rem;
}
.footer__col a { color: rgba(0,0,0,0.6); text-decoration: none; }
.footer__col-title {
  font-weight: 500;
  font-size: 1rem;
  letter-spacing: 0.2em;
  margin: 0 0 0.5rem;
}
.footer__bottom {
  max-width: 1240px;
  margin: 0 auto;
  padding-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}
.footer__copy { font-size: 0.875rem; color: rgba(0,0,0,0.6); margin: 0; }
.footer__payments { display: flex; gap: 0.75rem; }
.footer__payment-badge { height: 30px; width: auto; }

@media (max-width: 1024px) {
  .nav-bar { padding: 1rem 2rem; }
  .nav-bar__links { display: none; }
  .hero__inner { padding: 3rem 2rem; flex-direction: column; text-align: center; }
  .hero__content { max-width: 100%; }
  .hero__stats { justify-content: center; }
  .brands { padding: 2rem 2rem; }
  .section { padding: 3rem 2rem; }
  .products__grid { grid-template-columns: repeat(2, 1fr); }
  .dress-styles__grid { grid-template-columns: 1fr 1fr; grid-template-rows: auto; }
  .dress-styles__grid .dress-style-card:nth-child(1),
  .dress-styles__grid .dress-style-card:nth-child(2),
  .dress-styles__grid .dress-style-card:nth-child(3),
  .dress-styles__grid .dress-style-card:nth-child(4) { grid-column: auto; grid-row: auto; }
  .testimonials__grid { grid-template-columns: 1fr; }
  .newsletter { margin: 0 2rem 2rem; padding: 2rem; flex-direction: column; text-align: center; }
  .newsletter__form { align-items: center; }
  .footer { padding: 3rem 2rem; }
  .footer__inner { flex-direction: column; }
  .footer__columns { flex-wrap: wrap; }
}

@media (max-width: 640px) {
  .products__grid { grid-template-columns: 1fr; }
  .dress-styles__grid { grid-template-columns: 1fr; }
  .newsletter__input-wrap,
  .newsletter__submit { width: 100%; }
}
</style>
