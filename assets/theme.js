/**
 * Paula Home Shopify Theme - Main JavaScript
 * Cart Drawer, Mobile Nav, Search, Add to Cart
 */

(function () {
  'use strict';

  /* ========================================
     CART DRAWER
     ======================================== */
  const Cart = {
    panel: document.querySelector('[data-cart-panel]'),
    overlay: document.querySelector('[data-cart-overflow]'),
    itemsContainer: document.querySelector('[data-cart-items]'),
    emptyState: document.querySelector('[data-cart-empty]'),
    footer: document.querySelector('[data-cart-footer]'),
    subtotalEl: document.querySelector('[data-cart-subtotal]'),
    countEls: document.querySelectorAll('[data-cart-count], [data-cart-panel-count]'),
    itemTemplate: document.getElementById('cart-item-template'),
    isOpen: false,
    cartData: null,

    init() {
      // Open cart buttons
      document.querySelectorAll('[data-cart-open]').forEach(btn => {
        btn.addEventListener('click', () => this.open());
      });

      // Close cart buttons
      document.querySelectorAll('[data-cart-close]').forEach(btn => {
        btn.addEventListener('click', () => this.close());
      });

      // Close on overlay click
      if (this.overlay) {
        this.overlay.addEventListener('click', () => this.close());
      }

      // Close on Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) this.close();
      });

      // Initial fetch
      this.fetchCart();

      // Add to cart buttons
      document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const variantId = btn.dataset.variantId;
          const qtySource = btn.dataset.qtySource ? document.querySelector(btn.dataset.qtySource) : null;
          let qty = parseInt(btn.dataset.qty || (qtySource && qtySource.value) || 1, 10);
          if (isNaN(qty) || qty < 1) qty = 1;
          if (variantId) {
            this.addItem(variantId, qty);
          }
        });
      });

      // Cart item interactions (delegated)
      if (this.itemsContainer) {
        this.itemsContainer.addEventListener('click', (e) => {
          const target = e.target.closest('button');
          if (!target) return;

          const itemEl = target.closest('[data-cart-item]');
          if (!itemEl) return;

          const key = itemEl.dataset.key;

          if (target.hasAttribute('data-qty-inc')) {
            const currentQty = parseInt(itemEl.querySelector('[data-qty-value]').textContent, 10);
            this.updateItem(key, currentQty + 1);
          } else if (target.hasAttribute('data-qty-dec')) {
            const currentQty = parseInt(itemEl.querySelector('[data-qty-value]').textContent, 10);
            if (currentQty > 1) {
              this.updateItem(key, currentQty - 1);
            }
          } else if (target.hasAttribute('data-item-remove')) {
            this.updateItem(key, 0);
          }
        });
      }
    },

    async fetchCart() {
      try {
        const res = await fetch('/cart.js');
        this.cartData = await res.json();
        this.renderCart();
      } catch (err) {
        console.error('Error fetching cart:', err);
      }
    },

    async addItem(variantId, qty = 1) {
      try {
        const res = await fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            items: [{ id: parseInt(variantId, 10), quantity: qty }]
          })
        });

        if (!res.ok) throw new Error('Add to cart failed');

        this.cartData = await res.json();
        this.renderCart();
        this.open();
      } catch (err) {
        console.error('Error adding to cart:', err);
      }
    },

    async updateItem(key, qty) {
      try {
        const res = await fetch('/cart/change.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ id: key, quantity: qty })
        });

        if (!res.ok) throw new Error('Update cart failed');

        this.cartData = await res.json();
        this.renderCart();
      } catch (err) {
        console.error('Error updating cart:', err);
      }
    },

    renderCart() {
      if (!this.cartData) return;

      const { item_count, items, total_price } = this.cartData;

      // Update count badges
      this.countEls.forEach(el => {
        el.textContent = item_count;
        el.style.display = item_count > 0 ? 'flex' : 'none';
      });

      // Update subtotal
      if (this.subtotalEl) {
        this.subtotalEl.textContent = this.formatMoney(total_price);
      }

      // Show empty state or items
      if (item_count === 0) {
        if (this.emptyState) this.emptyState.style.display = 'flex';
        if (this.itemsContainer) this.itemsContainer.style.display = 'none';
        if (this.footer) this.footer.style.display = 'none';
      } else {
        if (this.emptyState) this.emptyState.style.display = 'none';
        if (this.itemsContainer) {
          this.itemsContainer.style.display = 'block';
          this.renderItems(items);
        }
        if (this.footer) this.footer.style.display = 'block';
      }

      // Update panel count
      const panelCount = document.querySelector('[data-cart-panel-count]');
      if (panelCount) panelCount.textContent = item_count;
    },

    renderItems(items) {
      if (!this.itemsContainer || !this.itemTemplate) return;

      this.itemsContainer.innerHTML = '';

      items.forEach(item => {
        const clone = this.itemTemplate.content.cloneNode(true);
        const itemEl = clone.querySelector('[data-cart-item]');
        itemEl.dataset.key = item.key;

        const titleEl = clone.querySelector('[data-item-title]');
        if (titleEl) titleEl.textContent = item.product_title;

        const skuEl = clone.querySelector('[data-item-sku]');
        if (skuEl && item.sku) skuEl.textContent = `SKU ${item.sku}`;
        else if (skuEl) skuEl.style.display = 'none';

        const qtyEl = clone.querySelector('[data-qty-value]');
        if (qtyEl) qtyEl.textContent = item.quantity;

        const priceEl = clone.querySelector('[data-item-price]');
        if (priceEl) priceEl.textContent = this.formatMoney(item.line_price);

        this.itemsContainer.appendChild(clone);
      });
    },

    formatMoney(cents) {
      const format = window.theme?.moneyFormat || '${{amount}}';
      const amount = (cents / 100).toFixed(2).replace(/\.00$/, '');
      return format.replace('{{amount}}', amount.replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
    },

    open() {
      if (!this.panel) return;
      this.isOpen = true;
      this.panel.classList.add('is-open');
      if (this.overlay) this.overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    },

    close() {
      if (!this.panel) return;
      this.isOpen = false;
      this.panel.classList.remove('is-open');
      if (this.overlay) this.overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  };

  /* ========================================
     MOBILE NAVIGATION
     ======================================== */
  const MobileNav = {
    init() {
      const toggle = document.querySelector('[data-mobile-toggle]');
      const nav = document.querySelector('[data-mobile-nav]');

      if (!toggle || !nav) return;

      toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('is-open');
        const menuIcon = toggle.querySelector('.header__menu-icon');
        const closeIcon = toggle.querySelector('.header__close-icon');

        if (menuIcon && closeIcon) {
          menuIcon.style.display = isOpen ? 'none' : 'block';
          closeIcon.style.display = isOpen ? 'block' : 'none';
        }

        toggle.setAttribute('aria-expanded', isOpen);
      });
    }
  };

  /* ========================================
     HEADER SEARCH (autosuggest)
     ======================================== */
  const HeaderSearch = {
    init() {
      const searchInput = document.querySelector('[data-search-input]');
      const results = document.querySelector('[data-search-results]');

      if (!searchInput || !results) return;

      let debounceTimer;

      searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        const query = searchInput.value.trim();

        if (query.length === 0) {
          results.classList.remove('is-open');
          return;
        }

        debounceTimer = setTimeout(() => {
          this.search(query);
        }, 300);
      });

      searchInput.addEventListener('focus', () => {
        const query = searchInput.value.trim();
        if (query.length > 0) {
          results.classList.add('is-open');
        }
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        const searchContainer = e.target.closest('[data-search]');
        if (!searchContainer) {
          results.classList.remove('is-open');
        }
      });
    },

    async search(query) {
      const results = document.querySelector('[data-search-results]');
      if (!results) return;

      try {
        const res = await fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=6`);
        const data = await res.json();
        const products = data.resources?.results?.products || [];

        if (products.length === 0) {
          results.innerHTML = `<div class="header__search-empty">Sin resultados para "${query}".</div>`;
        } else {
          results.innerHTML = products.map(p => {
            const price = (p.price / 100).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return `
              <a href="${p.url}" onclick="this.parentElement.classList.remove('is-open')">
                <span>${p.title}</span>
                <span class="price">$${price}</span>
              </a>
            `;
          }).join('');
        }

        results.classList.add('is-open');
      } catch (err) {
        console.error('Search error:', err);
      }
    }
  };

  /* ========================================
     CAROUSEL (product pages)
     ======================================== */
  const Carousel = {
    init() {
      document.querySelectorAll('[data-carousel]').forEach(el => {
        const track = el.querySelector('[data-carousel-track]');
        const slides = track.querySelectorAll('.product-carousel__slide');
        const dots = el.querySelectorAll('[data-carousel-dot]');
        const prev = el.querySelector('[data-carousel-prev]');
        const next = el.querySelector('[data-carousel-next]');
        let current = 0;

        const goTo = (i) => {
          current = Math.max(0, Math.min(i, slides.length - 1));
          track.scrollTo({ left: current * track.offsetWidth, behavior: 'smooth' });
          dots.forEach((d, idx) => d.classList.toggle('product-carousel__dot--active', idx === current));
        };

        if (prev) prev.addEventListener('click', () => goTo(current - 1));
        if (next) next.addEventListener('click', () => goTo(current + 1));
        dots.forEach(d => d.addEventListener('click', () => goTo(parseInt(d.dataset.carouselDot))));
      });
    }
  };

  /* ========================================
     QTY PICKER (product pages)
     ======================================== */
  const QtyPicker = {
    init() {
      document.querySelectorAll('[data-qty-minus], [data-qty-plus]').forEach(btn => {
        btn.addEventListener('click', () => {
          const input = btn.closest('.qty-picker')?.querySelector('[data-qty-input]');
          if (!input) return;
          const delta = btn.hasAttribute('data-qty-plus') ? 1 : -1;
          input.value = Math.max(1, (parseInt(input.value, 10) || 1) + delta);
          const addBtn = btn.closest('form')?.querySelector('[data-add-to-cart]');
          if (addBtn) addBtn.dataset.qty = input.value;
        });
      });
    }
  };

  /* ========================================
     INITIALIZE
     ======================================== */
  document.addEventListener('DOMContentLoaded', () => {
    Cart.init();
    MobileNav.init();
    HeaderSearch.init();
    Carousel.init();
    QtyPicker.init();
  });

})();
