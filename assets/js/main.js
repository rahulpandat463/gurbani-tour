/**
 * AuraTravels / SetuVoyage - Core Interactive Travel Engine
 * Comprehensive Package Configurator, Services Showcase & Booking Flows
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Pricing Engine
  initPriceCalculator();

  // 2. Interactive Gallery Switcher
  initGallerySwitcher();

  // 3. Itinerary Accordions
  initItineraryAccordions();

  // 4. Hello Travel Services Filter
  initServicesFilter();

  // 5. Departure Cities Search & Auto-Select
  initDepartureCities();

  // 6. FAQ Accordion
  initFaqAccordion();

  // 7. Modals & WhatsApp Lead Dispatch
  initBookingModal();

  // 8. Sticky Nav Highlighting
  initStickyNavSpy();

  // 9. Mobile Menu & Coupon Copy
  initMobileMenu();
});

/* =========================================================================
   1. REAL-TIME PRICE CALCULATOR
   ========================================================================= */
const PRICING_CONFIG = {
  basePerAdult: 21999,
  basePerKid: 11999,
  hotelTiers: {
    '3star': 0,
    '4star': 5500,
    '5star': 13800
  },
  cabTiers: {
    'sedan': 0,
    'innova': 2400,
    'luxury': 8500
  },
  flightPerPerson: 18500
};

let currentPricingState = {
  adults: 2,
  kids: 0,
  hotelTier: '3star',
  cabTier: 'innova',
  hasFlight: false,
  departureCity: 'Mumbai'
};

function initPriceCalculator() {
  const adultValEl = document.getElementById('calcAdults');
  const kidValEl = document.getElementById('calcKids');
  const flightToggle = document.getElementById('calcFlightToggle');
  const citySelect = document.getElementById('calcCity');

  // Adult Counter
  document.getElementById('adultPlus')?.addEventListener('click', () => {
    currentPricingState.adults++;
    if (adultValEl) adultValEl.textContent = currentPricingState.adults;
    recalculatePrice();
  });
  document.getElementById('adultMinus')?.addEventListener('click', () => {
    if (currentPricingState.adults > 1) {
      currentPricingState.adults--;
      if (adultValEl) adultValEl.textContent = currentPricingState.adults;
      recalculatePrice();
    }
  });

  // Kid Counter
  document.getElementById('kidPlus')?.addEventListener('click', () => {
    currentPricingState.kids++;
    if (kidValEl) kidValEl.textContent = currentPricingState.kids;
    recalculatePrice();
  });
  document.getElementById('kidMinus')?.addEventListener('click', () => {
    if (currentPricingState.kids > 0) {
      currentPricingState.kids--;
      if (kidValEl) kidValEl.textContent = currentPricingState.kids;
      recalculatePrice();
    }
  });

  // Hotel Tier Radio
  document.querySelectorAll('input[name="hotelTier"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      currentPricingState.hotelTier = e.target.value;
      recalculatePrice();
    });
  });

  // Cab Tier Radio
  document.querySelectorAll('input[name="cabTier"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      currentPricingState.cabTier = e.target.value;
      recalculatePrice();
    });
  });

  // Flight Toggle
  if (flightToggle) {
    flightToggle.addEventListener('change', (e) => {
      currentPricingState.hasFlight = e.target.checked;
      recalculatePrice();
    });
  }

  // City Select
  if (citySelect) {
    citySelect.addEventListener('change', (e) => {
      currentPricingState.departureCity = e.target.value;
      recalculatePrice();
    });
  }

  recalculatePrice();
}

function recalculatePrice() {
  const { adults, kids, hotelTier, cabTier, hasFlight } = currentPricingState;

  const hotelAddonPerPerson = PRICING_CONFIG.hotelTiers[hotelTier] || 0;
  const cabAddonTotal = PRICING_CONFIG.cabTiers[cabTier] || 0;
  const flightAddonPerPerson = hasFlight ? PRICING_CONFIG.flightPerPerson : 0;

  // Base per adult
  const costPerAdult = PRICING_CONFIG.basePerAdult + hotelAddonPerPerson + flightAddonPerPerson;
  const costPerKid = PRICING_CONFIG.basePerKid + (hotelAddonPerPerson * 0.5) + flightAddonPerPerson;

  const totalCost = (costPerAdult * adults) + (costPerKid * kids) + cabAddonTotal;
  const perPersonDisplay = Math.round(totalCost / (adults + (kids * 0.5)));
  const originalPerPerson = Math.round(perPersonDisplay * 1.35); // 35% strike-through savings

  // Update DOM elements
  const currentPriceEl = document.getElementById('displayCurrentPrice');
  const originalPriceEl = document.getElementById('displayOldPrice');
  const totalSummaryEl = document.getElementById('displayTotalSummary');
  const mobilePriceEl = document.getElementById('mobileDisplayPrice');

  const formattedPerPerson = '₹' + perPersonDisplay.toLocaleString('en-IN');
  const formattedOriginal = '₹' + originalPerPerson.toLocaleString('en-IN');
  const formattedTotal = '₹' + totalCost.toLocaleString('en-IN');

  if (currentPriceEl) currentPriceEl.innerHTML = `${formattedPerPerson} <span>/ person</span>`;
  if (originalPriceEl) originalPriceEl.textContent = formattedOriginal;
  if (totalSummaryEl) {
    totalSummaryEl.innerHTML = `Total for ${adults} Adults${kids > 0 ? `, ${kids} Kids` : ''}: <strong>${formattedTotal}</strong> (All Taxes & Transfers Included)`;
  }
  if (mobilePriceEl) mobilePriceEl.textContent = formattedPerPerson;
}

/* =========================================================================
   2. INTERACTIVE GALLERY SWITCHER
   ========================================================================= */
function initGallerySwitcher() {
  const mainImg = document.getElementById('galleryMainImg');
  const mainBadge = document.getElementById('galleryMainBadge');
  const thumbnails = document.querySelectorAll('.thumbnail-item');

  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbnails.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');

      const fullSrc = thumb.getAttribute('data-full');
      const caption = thumb.getAttribute('data-caption');

      if (mainImg && fullSrc) {
        mainImg.style.opacity = '0.4';
        setTimeout(() => {
          mainImg.src = fullSrc;
          mainImg.style.opacity = '1';
        }, 150);
      }
      if (mainBadge && caption) {
        mainBadge.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${caption}`;
      }
    });
  });
}

/* =========================================================================
   3. ITINERARY ACCORDIONS
   ========================================================================= */
function initItineraryAccordions() {
  const dayCards = document.querySelectorAll('.day-card');
  const expandAllBtn = document.getElementById('btnExpandItinerary');

  dayCards.forEach(card => {
    const header = card.querySelector('.day-header');
    header?.addEventListener('click', () => {
      const isCurrentlyActive = header.classList.contains('active');
      const content = card.querySelector('.day-content');

      if (isCurrentlyActive) {
        header.classList.remove('active');
        if (content) content.style.display = 'none';
      } else {
        header.classList.add('active');
        if (content) content.style.display = 'grid';
      }
    });
  });

  if (expandAllBtn) {
    expandAllBtn.addEventListener('click', () => {
      const shouldExpand = expandAllBtn.getAttribute('data-state') !== 'expanded';
      dayCards.forEach(card => {
        const header = card.querySelector('.day-header');
        const content = card.querySelector('.day-content');
        if (shouldExpand) {
          header?.classList.add('active');
          if (content) content.style.display = 'grid';
        } else {
          header?.classList.remove('active');
          if (content) content.style.display = 'none';
        }
      });
      expandAllBtn.setAttribute('data-state', shouldExpand ? 'expanded' : 'collapsed');
      expandAllBtn.innerHTML = shouldExpand 
        ? '<i class="fa-solid fa-compress"></i> Collapse All Days' 
        : '<i class="fa-solid fa-expand"></i> Expand All Days';
    });
  }
}

/* =========================================================================
   4. HELLO TRAVEL COMPLETE SERVICES FILTER
   ========================================================================= */
function initServicesFilter() {
  const filterBtns = document.querySelectorAll('.service-filter-btn');
  const serviceCards = document.querySelectorAll('.service-master-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-category');

      serviceCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardCategory === filterCategory) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* =========================================================================
   5. DEPARTURE CITIES SEARCH & SELECTION
   ========================================================================= */
function initDepartureCities() {
  const cityInput = document.getElementById('citySearchInput');
  const cityButtons = document.querySelectorAll('.city-pill-btn');
  const calcCityDropdown = document.getElementById('calcCity');

  if (cityInput) {
    cityInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      cityButtons.forEach(btn => {
        const cityName = btn.getAttribute('data-city').toLowerCase();
        if (cityName.includes(term)) {
          btn.style.display = 'flex';
        } else {
          btn.style.display = 'none';
        }
      });
    });
  }

  cityButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedCity = btn.getAttribute('data-city');
      currentPricingState.departureCity = selectedCity;
      if (calcCityDropdown) {
        calcCityDropdown.value = selectedCity;
      }
      recalculatePrice();

      // Smooth scroll back to booking card
      document.getElementById('bookingCard')?.scrollIntoView({ behavior: 'smooth' });

      // Visual flash
      const bookingCard = document.getElementById('bookingCard');
      if (bookingCard) {
        bookingCard.style.outline = '3px solid #0d9488';
        setTimeout(() => bookingCard.style.outline = 'none', 1200);
      }
    });
  });
}

/* =========================================================================
   6. FAQ ACCORDION
   ========================================================================= */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* =========================================================================
   7. BOOKING MODAL & WHATSAPP INTEGRATION
   ========================================================================= */
function initBookingModal() {
  const modalOverlay = document.getElementById('bookingModal');
  const openModalBtns = document.querySelectorAll('.btn-open-modal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const leadForm = document.getElementById('leadQuoteForm');
  const whatsappTriggers = document.querySelectorAll('.btn-direct-whatsapp');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modalOverlay) modalOverlay.classList.add('active');
    });
  });

  closeModalBtn?.addEventListener('click', () => {
    if (modalOverlay) modalOverlay.classList.remove('active');
  });

  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('active');
    }
  });

  // Handle Form Submission
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('leadName')?.value || 'Guest';
      const phone = document.getElementById('leadPhone')?.value || '';
      const email = document.getElementById('leadEmail')?.value || '';
      const travelDate = document.getElementById('leadDate')?.value || 'Upcoming';
      const hotelPref = currentPricingState.hotelTier;
      const adults = currentPricingState.adults;
      const kids = currentPricingState.kids;
      const city = currentPricingState.departureCity;

      // Construct WhatsApp message
      const message = `Hello AuraTravels Team! 🌴
I want to book/customize the Bali 4D/3N Summer Tour Package:
• Name: ${name}
• Phone: ${phone}
• Email: ${email}
• Departure City: ${city}
• Travel Date: ${travelDate}
• Guests: ${adults} Adults, ${kids} Kids
• Hotel Preference: ${hotelPref.toUpperCase()}
• Flights Included: ${currentPricingState.hasFlight ? 'Yes (Include Flight Fare)' : 'No (Land Package Only)'}
Please send me the detailed proposal and quotation!`;

      const encodedMsg = encodeURIComponent(message);
      const waUrl = `https://wa.me/918046801919?text=${encodedMsg}`;

      // Show alert & redirect
      alert(`Thank you, ${name}! Your Bali package request has been prepared. Redirecting to our Bali Holiday Expert on WhatsApp...`);
      window.open(waUrl, '_blank');
      modalOverlay?.classList.remove('active');
    });
  }

  // Floating WhatsApp Direct Click
  whatsappTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const message = `Hi! I am interested in the Bali 4 Days / 3 Nights Summer Vacation Package (Starting ₹21,999). Please share more details and available departure dates!`;
      const waUrl = `https://wa.me/918046801919?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');
    });
  });
}

/* =========================================================================
   8. STICKY NAV SPY & SMOOTH SCROLLING
   ========================================================================= */
function initStickyNavSpy() {
  const navTabs = document.querySelectorAll('.tab-nav-item');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navTabs.forEach(tab => {
      tab.classList.remove('active');
      if (tab.getAttribute('href') === `#${currentSectionId}`) {
        tab.classList.add('active');
      }
    });
  });
}

// Global print function for Itinerary
window.downloadItineraryPdf = function() {
  window.print();
};

/* =========================================================================
   9. MOBILE MENU DRAWER & COUPON CLICK-TO-COPY
   ========================================================================= */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  const icon = document.getElementById('menuToggleIcon');
  const drawerLinks = document.querySelectorAll('.mobile-drawer-link');

  menuBtn?.addEventListener('click', () => {
    const isActive = drawer?.classList.toggle('active');
    if (icon) {
      icon.className = isActive ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    }
  });

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer?.classList.remove('active');
      if (icon) icon.className = 'fa-solid fa-bars';
    });
  });

  // Copy coupon on click
  const coupon = document.getElementById('couponCode');
  coupon?.addEventListener('click', () => {
    navigator.clipboard?.writeText('BALI2026');
    const originalText = coupon.textContent;
    coupon.textContent = 'COPIED! 🎉';
    setTimeout(() => {
      coupon.textContent = originalText;
    }, 2000);
  });
}
