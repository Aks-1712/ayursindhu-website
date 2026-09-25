/**
 * AYURSINDHU — MODERN AYURVEDA BRAND ENGINE
 * Interactive features: Cart Drawer, Quick View Modal, Dosha Guide, Smooth Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Product Catalog Database ---
  const productsData = {
    'dantkanti': {
      id: 'dantkanti',
      name: 'DantKanti',
      tagline: 'Ayurvedic Botanical Oral Care',
      tag: 'Coming Soon',
      price: 495,
      formattedPrice: '₹495',
      volume: '100g Tube & 250ml Elixir',
      image: 'product-coming-soon.jpg',
      description: 'A time-honored botanical tooth and gum elixir, thoughtfully blending Babool, Bakul, Akarkara, Clove, and field mint to protect tooth enamel and tone gum tissue.',
      ingredients: 'Acacia Arabica (Babool), Syzygium Aromaticum (Clove), Anacyclus Pyrethrum (Akarkara), Mentha Arvensis (Field Mint).',
      ritual: 'Brush twice daily using gentle circular motions. Swish with warm water for 30 seconds to awaken the oral microbiome.',
      category: 'oral-care'
    },
    'snuhyadi-tel': {
      id: 'snuhyadi-tel',
      name: 'Snuhyadi Tel',
      tagline: 'Restorative Botanical Hair & Scalp Oil',
      tag: 'Coming Soon',
      price: 1250,
      formattedPrice: '₹1,250',
      volume: '100ml / 3.38 fl oz',
      image: 'product-coming-soon.jpg',
      description: 'Traditional restorative hair and scalp oil formulated with cold-pressed black sesame, wild amla, and rare botanical herbs to deeply nourish the root bed and calm mental tension.',
      ingredients: 'Sesamum Indicum (Black Sesame), Emblica Officinalis (Amla), Snuhyadi Herbal Extract, Eclipta Prostrata (Bhringraj).',
      ritual: 'Warm 5–8 drops between palms. Part dry hair and massage in circular rhythms directly onto the scalp. Leave for 45 minutes or overnight.',
      category: 'hair-scalp'
    },
    'detan-wash': {
      id: 'detan-wash',
      name: 'Shuddhi Ayurvedic Face Wash',
      tagline: 'Cleanses • Purifies • Refreshes',
      tag: 'Coming Soon',
      price: 495,
      formattedPrice: '₹495',
      volume: '100 ml',
      image: 'product-coming-soon.jpg',
      description: 'Pure care for naturally fresh & healthy skin. Formulated with pure Neem, Tulsi, Tea Tree, and Aloe Vera to deep-cleanse pores, eliminate impurities, and balance natural oils without drying.',
      ingredients: 'Azadirachta Indica (Neem), Ocimum Sanctum (Tulsi), Melaleuca Alternifolia (Tea Tree), Aloe Barbadensis (Aloe Vera).',
      ritual: 'Apply a small amount to moist face and neck. Gently work up a rich lather using circular motions. Wash off with lukewarm water and pat dry.',
      category: 'facial-radiance'
    },
    'wellness-essentials': {
      id: 'wellness-essentials',
      name: 'Ayurvedic Wellness Essentials',
      tagline: 'Ojas Restorative Night Nectar',
      tag: 'Coming Soon',
      price: 1850,
      formattedPrice: '₹1,850',
      volume: '50ml / 1.7 fl oz Jar',
      image: 'product-coming-soon.jpg',
      description: 'An ultra-refined restorative night balm blending precious botanical extracts to replenish cellular hydration, protect skin vitality, and ground the nervous system before sleep.',
      ingredients: 'Withania Somnifera (Ashwagandha), Centella Asiatica (Gotu Kola), Pure Ghee Clarified Extract, Saffron Essence.',
      ritual: 'Smooth a pea-sized amount over cleansed skin before sleep. Inhale the warm, grounded botanical aroma to settle your senses.',
      category: 'daily-rituals'
    }
  };

  // --- Cart State ---
  let cart = [];

  // --- DOM Elements ---
  const header = document.querySelector('.site-header');
  const cartToggleBtn = document.getElementById('cartToggleBtn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartDrawerOverlay');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartBadge = document.getElementById('cartBadge');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const shippingProgressFill = document.getElementById('shippingProgressFill');
  const shippingText = document.getElementById('shippingText');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const quickViewModal = document.getElementById('quickViewModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const toastContainer = document.getElementById('toastContainer');
  const newsletterForm = document.getElementById('newsletterForm');

  // --- Sticky Header Scroll Effect ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Mobile Hamburger Menu ---
  if (hamburgerBtn && mobileNavDrawer) {
    hamburgerBtn.addEventListener('click', () => {
      const isActive = mobileNavDrawer.classList.toggle('active');
      hamburgerBtn.classList.toggle('active');
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // Close mobile menu when clicking nav links
    const mobileLinks = mobileNavDrawer.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNavDrawer.classList.remove('active');
        hamburgerBtn.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Cart Drawer Open/Close ---
  function openCart() {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderCart();
  }

  function closeCart() {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  // --- Render Cart Functionality ---
  function renderCart() {
    if (!cartItemsList) return;

    let subtotal = 0;
    let totalItems = 0;

    if (cart.length === 0) {
      cartItemsList.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem;">
          <p style="font-family: var(--font-serif); font-size: 1.35rem; color: var(--text-primary); margin-bottom: 0.5rem;">Your Ritual Bag is Empty</p>
          <p style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1.5rem;">Begin your journey with our thoughtfully formulated Ayurvedic essentials.</p>
          <button class="btn btn-secondary btn-sm" onclick="document.getElementById('closeCartBtn').click(); window.location.hash = '#products';">Explore Formulations</button>
        </div>
      `;
    } else {
      cartItemsList.innerHTML = cart.map(item => {
        const product = productsData[item.id];
        if (!product) return '';
        const itemTotal = product.price * item.qty;
        subtotal += itemTotal;
        totalItems += item.qty;

        return `
          <div class="cart-item-row" data-id="${item.id}">
            <img src="${product.image}" alt="${product.name}" class="cart-item-thumb">
            <div class="cart-item-info">
              <h4 class="cart-item-name">${product.name}</h4>
              <p class="cart-item-vol">${product.volume}</p>
              <div class="cart-item-qty-row">
                <div class="qty-control">
                  <button class="qty-btn dec-btn" data-id="${item.id}">−</button>
                  <span class="qty-val">${item.qty}</span>
                  <button class="qty-btn inc-btn" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item-price">₹${itemTotal.toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    if (cartBadge) {
      cartBadge.textContent = totalItems;
      cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    if (cartSubtotalEl) {
      cartSubtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    }

    // Free shipping calculation (threshold ₹999)
    const freeShippingThreshold = 999;
    if (shippingProgressFill && shippingText) {
      if (subtotal >= freeShippingThreshold) {
        shippingProgressFill.style.width = '100%';
        shippingText.innerHTML = `<strong>Congratulations!</strong> You unlocked complimentary shipping across India.`;
      } else {
        const remaining = freeShippingThreshold - subtotal;
        const percent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
        shippingProgressFill.style.width = `${percent}%`;
        shippingText.innerHTML = `Add <strong>₹${remaining.toLocaleString('en-IN')}</strong> more for complimentary insured delivery.`;
      }
    }

    // Bind quantity increment/decrement buttons
    const incBtns = cartItemsList.querySelectorAll('.inc-btn');
    const decBtns = cartItemsList.querySelectorAll('.dec-btn');

    incBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const prodId = e.currentTarget.getAttribute('data-id');
        const item = cart.find(i => i.id === prodId);
        if (item) {
          item.qty += 1;
          renderCart();
        }
      });
    });

    decBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const prodId = e.currentTarget.getAttribute('data-id');
        const itemIndex = cart.findIndex(i => i.id === prodId);
        if (itemIndex > -1) {
          if (cart[itemIndex].qty > 1) {
            cart[itemIndex].qty -= 1;
          } else {
            cart.splice(itemIndex, 1);
          }
          renderCart();
        }
      });
    });
  }

  // --- Add to Cart Handler ---
  function addToCart(productId, qty = 1) {
    const existing = cart.find(item => item.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ id: productId, qty: qty });
    }
    const product = productsData[productId];
    showToast(`Added ${product ? product.name : 'item'} to your Ritual Bag.`);
    renderCart();
    openCart();
  }

  // Bind Add to Cart / Coming Soon on product cards
  document.querySelectorAll('.btn-add-ritual').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const prodId = btn.getAttribute('data-id');
      const product = productsData[prodId];
      if (btn.classList.contains('coming-soon-btn')) {
        showToast(`${product ? product.name : 'This formulation'} is coming soon. Stay tuned!`);
        return;
      }
      if (prodId) addToCart(prodId, 1);
    });
  });

  // --- Quick View Modal Functionality ---
  function openQuickView(productId) {
    const product = productsData[productId];
    if (!product || !quickViewModal) return;

    document.getElementById('modalProductImg').src = product.image;
    document.getElementById('modalProductImg').alt = product.name;
    document.getElementById('modalBadge').textContent = product.tag;
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalPrice').textContent = product.formattedPrice;
    document.getElementById('modalDesc').textContent = product.description;
    document.getElementById('modalRitualNote').innerHTML = `
      <strong>The Daily Ritual:</strong> ${product.ritual}
    `;
    document.getElementById('modalIngredients').textContent = product.ingredients;

    // Set Add to Bag button in modal
    const modalAddBtn = document.getElementById('modalAddBtn');
    modalAddBtn.textContent = 'Coming Soon • Launching Soon';
    modalAddBtn.onclick = () => {
      showToast(`${product.name} is coming soon. Stay tuned for launch!`);
      closeQuickView();
    };

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeQuickView() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeQuickView);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeQuickView();
    });
  }

  // Trigger quick view from cards
  document.querySelectorAll('.quick-view-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const prodId = trigger.getAttribute('data-id');
      if (prodId) openQuickView(prodId);
    });
  });

  document.querySelectorAll('.view-product-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const prodId = link.getAttribute('data-id');
      if (prodId) openQuickView(prodId);
    });
  });

  // --- Product Category Filter Buttons ---
  const filterPills = document.querySelectorAll('.filter-pill');
  const productCards = document.querySelectorAll('.product-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filterValue = pill.getAttribute('data-filter');

      productCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- Interactive Dosha Harmony Switcher ---
  const doshaTabs = document.querySelectorAll('.dosha-tab-btn');
  const doshaData = {
    'vata': {
      title: 'Vata Harmonization (Air & Ether)',
      desc: 'Characterized by lightness, movement, and dryness. When balanced, Vata embodies creativity and vitality; when elevated, it calls for deeply nourishing, warm, and grounding herbal elixirs.',
      element: 'Air & Ether',
      quality: 'Dry, Light, Mobile',
      season: 'Autumn / Early Winter',
      ritualTitle: 'Nourishing Ojas & Root Scalp Ritual',
      ritualText: 'Incorporate warm herbal oils and restorative scalp massage to steady restless energy and seal deep biological hydration.',
      recProduct: 'Snuhyadi Tel',
      recMeta: 'Restorative Botanical Scalp & Hair Oil',
      recImg: 'product-snuhyadi-tel.jpg',
      recId: 'snuhyadi-tel'
    },
    'pitta': {
      title: 'Pitta Harmonization (Fire & Water)',
      desc: 'Governed by digestion, transformation, and clarity. Excessive heat manifests as skin redness and reactivity. Pitta rituals focus on cooling botanicals, soothing saffron, and delicate floral waters.',
      element: 'Fire & Water',
      quality: 'Warm, Sharp, Penetrating',
      season: 'Summer / High Sunlight',
      ritualTitle: 'Purifying Neem & Tulsi Cleansing Ritual',
      ritualText: 'Use gentle, non-stripping botanical cleansers enriched with Neem, Tulsi, and Aloe Vera to clarify environmental impurities and soothe redness.',
      recProduct: 'Shuddhi Face Wash',
      recMeta: 'Ayurvedic Neem & Tulsi Cleanser',
      recImg: 'product-detan-wash.jpg',
      recId: 'detan-wash'
    },
    'kapha': {
      title: 'Kapha Harmonization (Earth & Water)',
      desc: 'Anchored by stability, strength, and structural lubrication. When Kapha accumulates, it produces heaviness and sluggishness. It is harmonized through invigorating spices, clove, and stimulating rituals.',
      element: 'Earth & Water',
      quality: 'Heavy, Slow, Cool',
      season: 'Late Winter / Spring',
      ritualTitle: 'Invigorating Botanical Awakening',
      ritualText: 'Start your morning with warming aromatic spices like clove, babool, and mint to stimulate circulation and clear accumulated dullness.',
      recProduct: 'DantKanti',
      recMeta: 'Ayurvedic Botanical Oral Care',
      recImg: 'product-dantkanti.jpg',
      recId: 'dantkanti'
    }
  };

  doshaTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      doshaTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const doshaKey = tab.getAttribute('data-dosha');
      const data = doshaData[doshaKey];
      if (!data) return;

      document.getElementById('doshaTitle').textContent = data.title;
      document.getElementById('doshaDesc').textContent = data.desc;
      document.getElementById('doshaElement').textContent = data.element;
      document.getElementById('doshaQuality').textContent = data.quality;
      document.getElementById('doshaSeason').textContent = data.season;
      document.getElementById('ritualBoxHeading').textContent = data.ritualTitle;
      document.getElementById('ritualBoxP').textContent = data.ritualText;
      document.getElementById('recProductName').textContent = data.recProduct;
      document.getElementById('recProductMeta').textContent = data.recMeta;
      document.getElementById('recProductImg').src = data.recImg;
      document.getElementById('recProductImg').alt = data.recProduct;
      document.getElementById('recProductBtn').onclick = () => {
        openQuickView(data.recId);
      };
    });
  });

  // --- Newsletter Form Submission ---
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('.newsletter-input');
      const email = emailInput ? emailInput.value.trim() : '';

      if (email && email.includes('@') && email.includes('.')) {
        showToast('Welcome to AyurSindhu. Your inaugural wellness guide has been dispatched.');
        newsletterForm.reset();
      } else {
        showToast('Please enter a valid email address.');
      }
    });
  }

  // --- Toast Notification Helper ---
  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-gold); flex-shrink: 0;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 50);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 4000);
  }

  // --- Journal Article Modal Helper ---
  const journalArticles = {
    '1': {
      title: 'Understanding Ayurveda in Modern Life',
      readTime: '4 Min Read • Philosophy',
      content: `Ayurveda does not require leaving behind modern realities or adopting rigid ascetics. At its core, the science of Ayurveda teaches us *Prakriti*—the personal baseline of harmony—and how external daily rhythms influence our physical and mental equilibrium.<br><br>When practiced today, Ayurveda becomes an anchor: choosing whole botanical skincare, taking five intentional minutes for a soothing scalp massage before bed, and treating morning hygiene as an intentional reset rather than a rushed chore.`
    },
    '2': {
      title: 'Traditional Ingredients, Modern Rituals',
      readTime: '5 Min Read • Botanicals',
      content: `Why do ingredients like Babool, Kashmiri Saffron, and Snuhyadi stem extract withstand centuries of use? In classical Ayurvedic treatises such as the *Charaka Samhita*, these botanicals were classified by their *Rasa* (taste), *Virya* (potency), and *Vipaka* (post-digestive effect).<br><br>At AyurSindhu, we preserve these natural synergies without synthetic fillers, heavy mineral oils, or harsh chemical masking agents. The result is pure botanical integrity formulated for immediate comfort and seamless everyday usability.`
    },
    '3': {
      title: 'The Story Behind AyurSindhu',
      readTime: '6 Min Read • Heritage',
      content: `AyurSindhu was conceived from a simple yet profound observation: the world was caught between outdated clinic-style herbal formulations and commercial synthetic cosmetic lines.<br><br>We envisioned a modern expression of Indian wellness: formulations rooted in classical knowledge, blended with uncompromising quality, packaged with contemporary architectural minimalism, and dedicated to the conscious modern lifestyle.`
    }
  };

  document.querySelectorAll('.read-journal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const articleId = btn.getAttribute('data-article');
      const article = journalArticles[articleId];
      if (article) {
        document.getElementById('modalProductImg').src = 'about-editorial.jpg';
        document.getElementById('modalBadge').textContent = article.readTime;
        document.getElementById('modalTitle').textContent = article.title;
        document.getElementById('modalPrice').textContent = '';
        document.getElementById('modalDesc').innerHTML = article.content;
        document.getElementById('modalRitualNote').innerHTML = `<strong>AyurSindhu Editorial:</strong> Dedicated to respectful, authentic, and modern Ayurvedic wisdom.`;
        document.getElementById('modalIngredients').textContent = 'AyurSindhu Research & Botanical Formulations Archive.';
        document.getElementById('modalAddBtn').textContent = 'Close Entry';
        document.getElementById('modalAddBtn').onclick = closeQuickView;
        modalBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Initialize Cart View on Load
  renderCart();
});

