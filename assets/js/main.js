/**
 * Gurbani Tours and Travels - Trusted Holiday & Tour Specialist Platform
 * Core Interactive Application Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Trip Planner Search Engine
  initSearchPlanner();

  // 2. Initialize Universal "Plan A Trip" Modal
  initPlanTripModal();

  // 3. Initialize Interactive Agent Quote Simulator
  initQuoteSimulator();

  // 4. Initialize Destination & Services Tabs
  initInteractiveTabs();

  // 5. Initialize Mobile Navigation & Drawers
  initMobileNav();

  // 6. Initialize Coupon Code Copy & Toasts
  initCouponCopy();

  // 7. Initialize Packages Page Filtering (if on packages.html)
  initPackagesFilter();

  // 8. Initialize Contact & Agent Forms (if on contact.html)
  initContactForms();

  // 9. Initialize Tour Package Card Click & Detail Modal
  initPackageDetailModal();
});

/* =========================================================================
   1. TRIP PLANNER SEARCH ENGINE (HOMEPAGE HERO)
   ========================================================================= */
const POPULAR_FROM_CITIES = [
  'New Delhi / NCR', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai', 
  'Hyderabad', 'Ahmedabad', 'Pune', 'Jaipur', 'Chandigarh', 'Lucknow'
];

const POPULAR_DESTINATIONS = [
  'Kashmir & Gulmarg', 'Goa Beach Holiday', 'Kerala Backwaters & Munnar',
  'Himachal (Manali & Shimla)', 'Rajasthan (Jaipur & Udaipur)', 'Andaman Islands',
  'Ladakh & Leh', 'Dubai Luxe Tour', 'Bali Tropical Getaway', 'Thailand (Phuket & Krabi)',
  'Singapore & Sentosa', 'Maldives Private Resort', 'Vietnam Highlights', 'Switzerland & Paris'
];

function initSearchPlanner() {
  const fromInput = document.getElementById('searchCityFrom');
  const toInput = document.getElementById('searchCityTo');
  const fromSuggestions = document.getElementById('fromSuggestions');
  const toSuggestions = document.getElementById('toSuggestions');

  const durationMinus = document.getElementById('durationMinus');
  const durationPlus = document.getElementById('durationPlus');
  const durationVal = document.getElementById('durationVal');

  const filterTrigger = document.getElementById('filterDropdownTrigger');
  const filterPopup = document.getElementById('filterPopupBox');
  const priceRange = document.getElementById('priceRangeSlider');
  const priceDisplay = document.getElementById('priceDisplayVal');

  const btnSearchPlanner = document.getElementById('btnSearchPlanner');

  // Duration Counter
  let duration = 5;
  if (durationPlus && durationMinus && durationVal) {
    durationPlus.addEventListener('click', (e) => {
      e.stopPropagation();
      duration++;
      durationVal.textContent = `${duration} Days`;
    });
    durationMinus.addEventListener('click', (e) => {
      e.stopPropagation();
      if (duration > 2) {
        duration--;
        durationVal.textContent = `${duration} Days`;
      }
    });
  }

  // From City Autocomplete
  if (fromInput && fromSuggestions) {
    fromInput.addEventListener('focus', () => {
      renderSuggestions(POPULAR_FROM_CITIES, fromSuggestions, fromInput);
      fromSuggestions.classList.add('show');
    });

    fromInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      const filtered = POPULAR_FROM_CITIES.filter(c => c.toLowerCase().includes(q));
      renderSuggestions(filtered.length ? filtered : ['Other City'], fromSuggestions, fromInput);
      fromSuggestions.classList.add('show');
    });
  }

  // To Destination Autocomplete
  if (toInput && toSuggestions) {
    toInput.addEventListener('focus', () => {
      renderSuggestions(POPULAR_DESTINATIONS, toSuggestions, toInput);
      toSuggestions.classList.add('show');
    });

    toInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      const filtered = POPULAR_DESTINATIONS.filter(d => d.toLowerCase().includes(q));
      renderSuggestions(filtered.length ? filtered : ['Search any destination...'], toSuggestions, toInput);
      toSuggestions.classList.add('show');
    });
  }

  // Close suggestions when clicking outside
  document.addEventListener('click', (e) => {
    if (fromSuggestions && !fromSuggestions.contains(e.target) && e.target !== fromInput) {
      fromSuggestions.classList.remove('show');
    }
    if (toSuggestions && !toSuggestions.contains(e.target) && e.target !== toInput) {
      toSuggestions.classList.remove('show');
    }
    if (filterPopup && !filterPopup.contains(e.target) && !filterTrigger?.contains(e.target)) {
      filterPopup.classList.remove('show');
    }
  });

  // Filter Trigger
  if (filterTrigger && filterPopup) {
    filterTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      filterPopup.classList.toggle('show');
    });
  }

  // Price Slider Live Value
  if (priceRange && priceDisplay) {
    priceRange.addEventListener('input', (e) => {
      const val = Number(e.target.value).toLocaleString('en-IN');
      priceDisplay.textContent = `₹${val}/day`;
    });
  }

  // Star Pill Toggle
  document.querySelectorAll('.star-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.star-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  // Flight Option Toggle
  document.querySelectorAll('.flight-opt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.flight-opt-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Search Planner Submit
  if (btnSearchPlanner) {
    btnSearchPlanner.addEventListener('click', () => {
      const dest = toInput?.value.trim() || 'Kashmir';
      const from = fromInput?.value.trim() || 'Delhi';
      openPlanTripModal({
        destination: dest,
        fromCity: from,
        duration: `${duration} Days`
      });
    });
  }
}

function renderSuggestions(items, container, inputElement) {
  container.innerHTML = '';
  items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'suggestion-item';
    el.innerHTML = `<i class="fa-solid fa-location-dot"></i> <span>${item}</span>`;
    el.addEventListener('click', () => {
      inputElement.value = item;
      container.classList.remove('show');
    });
    container.appendChild(el);
  });
}

/* =========================================================================
   2. UNIVERSAL "PLAN A TRIP / GET 3 FREE QUOTES" MODAL
   ========================================================================= */
function initPlanTripModal() {
  const modal = document.getElementById('planTripModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const form = document.getElementById('planTripForm');

  // Trigger buttons across page
  document.querySelectorAll('.btn-open-quote-modal, .btn-dest-explore, #navPlanTripBtn, #topPlanTripBtn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const dest = btn.getAttribute('data-dest') || '';
      const pkg = btn.getAttribute('data-package') || '';
      openPlanTripModal({ destination: dest || pkg });
    });
  });

  // Specific "Get Free Quote" buttons on package cards
  document.querySelectorAll('.btn-get-quote').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // Don't trigger the card modal when clicking quote button
      const pkg = btn.getAttribute('data-package') || '';
      openPlanTripModal({ destination: pkg });
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const dest = document.getElementById('modalDestination')?.value || 'Your destination';
      const name = document.getElementById('modalName')?.value || 'Traveler';

      // Close modal
      modal?.classList.remove('active');

      // Trigger simulated matching toast & confetti-like feedback
      showToast(`🎉 Success, ${name}! Your trip request for ${dest} was sent to 3 top verified travel agents.`);

      // Simulated WhatsApp dispatch
      setTimeout(() => {
        showToast(`📲 Connect directly with your verified agents on WhatsApp: +91 80487 35999`);
      }, 3500);

      form.reset();
    });
  }
}

window.openPlanTripModal = function(options = {}) {
  const modal = document.getElementById('planTripModal');
  if (!modal) return;

  if (options.destination && document.getElementById('modalDestination')) {
    document.getElementById('modalDestination').value = options.destination;
  }
  if (options.fromCity && document.getElementById('modalFromCity')) {
    document.getElementById('modalFromCity').value = options.fromCity;
  }
  if (options.duration && document.getElementById('modalDuration')) {
    document.getElementById('modalDuration').value = options.duration;
  }

  modal.classList.add('active');
};

/* =========================================================================
   3. INTERACTIVE QUOTE SIMULATOR (WHY CHOOSE GURBANI TOURS)
   ========================================================================= */
const SIMULATOR_DATA = {
  'kashmir': [
    { name: 'Valley King Travels (Srinagar)', rating: '4.9★', deals: 'Houseboat + Private Innova Cab', price: '₹14,999' },
    { name: 'Kashmir Magic Holidays', rating: '4.8★', deals: '4-Star Gulmarg Hotel + Gondola Pass', price: '₹16,500' },
    { name: 'SnowPeak Expeditions', rating: '4.9★', deals: 'All Dinners Included + Shikara Ride', price: '₹15,200' }
  ],
  'bali': [
    { name: 'Bali Surya DMC', rating: '5.0★', deals: 'Private Pool Villa in Ubud + Sunset Cab', price: '₹24,500' },
    { name: 'Nusantara Tours Bali', rating: '4.8★', deals: 'Water Sports + Tanah Lot Tour', price: '₹26,900' },
    { name: 'IndoVoyage Specialists', rating: '4.9★', deals: 'Indian Dinners + Uluwatu VIP Entry', price: '₹25,400' }
  ],
  'dubai': [
    { name: 'Emirates Gate Tours', rating: '4.9★', deals: 'Burj Khalifa 124th Floor + Desert Safari', price: '₹28,999' },
    { name: 'Desert Rose Vacations', rating: '4.9★', deals: 'Marina Yacht Cruise + 4-Star Stay', price: '₹31,500' },
    { name: 'Gulf Wings Holidays', rating: '4.7★', deals: 'Fast-Track Dubai Visa Included', price: '₹29,800' }
  ],
  'goa': [
    { name: 'Goa Coastal Getaways', rating: '4.9★', deals: 'North & South Goa Cab + 4★ Beach Resort', price: '₹8,999' },
    { name: 'Mandovi Luxury Escapes', rating: '4.8★', deals: 'Mandovi Dinner Cruise + Scuba Diving', price: '₹10,500' },
    { name: 'Sun & Sand Tours Goa', rating: '4.9★', deals: 'Free Breakfast + Water Sports Combo', price: '₹9,499' }
  ]
};

function initQuoteSimulator() {
  const simSelect = document.getElementById('simDestSelect');
  const bidsContainer = document.getElementById('mockAgentBids');

  if (simSelect && bidsContainer) {
    simSelect.addEventListener('change', (e) => {
      renderSimBids(e.target.value, bidsContainer);
    });
    // Default render
    renderSimBids('kashmir', bidsContainer);
  }
}

function renderSimBids(destKey, container) {
  const bids = SIMULATOR_DATA[destKey] || SIMULATOR_DATA['kashmir'];
  container.innerHTML = bids.map((b, idx) => `
    <div class="mock-bid-card" style="animation: modalPop ${0.2 + idx * 0.15}s ease;">
      <div class="mock-bid-agent">
        <div class="mock-agent-avatar"><i class="fa-solid fa-user-tie"></i></div>
        <div>
          <div class="mock-agent-name">${b.name}</div>
          <div class="mock-agent-badge"><i class="fa-solid fa-certificate"></i> Verified Agent • ${b.rating} • ${b.deals}</div>
        </div>
      </div>
      <div class="mock-bid-price">
        <div class="mock-bid-cost">${b.price}</div>
        <div style="font-size: 0.72rem; color: #94a3b8;">Per Person</div>
      </div>
    </div>
  `).join('');
}

/* =========================================================================
   4. INTERACTIVE TABS (DESTINATIONS & SERVICES)
   ========================================================================= */
function initInteractiveTabs() {
  // Destination Category Tabs
  const destTabs = document.querySelectorAll('.filter-tab-btn[data-dest-filter]');
  const destCards = document.querySelectorAll('.destination-card[data-category]');

  destTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      destTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-dest-filter');
      destCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter || (filter === 'india' && cat.includes('india')) || (filter === 'international' && cat.includes('international'))) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Services Tab Filter (on services.html)
  const serviceTabs = document.querySelectorAll('.service-tab-btn');
  const serviceCards = document.querySelectorAll('.service-detail-item');

  serviceTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      serviceTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-service-filter');
      serviceCards.forEach(card => {
        const cat = card.getAttribute('data-cat');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'grid';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* =========================================================================
   5. MOBILE NAVIGATION & DRAWER
   ========================================================================= */
function initMobileNav() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  const icon = document.getElementById('menuToggleIcon');

  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', () => {
      drawer.classList.toggle('open');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    document.querySelectorAll('.mobile-drawer-link').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  // Sticky header shadow
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    if (header) {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  });
}

/* =========================================================================
   6. COUPON COPY & TOAST NOTIFICATION
   ========================================================================= */
function initCouponCopy() {
  const coupon = document.getElementById('couponCode');
  if (coupon) {
    coupon.addEventListener('click', () => {
      const code = coupon.textContent.trim();
      navigator.clipboard.writeText(code).then(() => {
        showToast(`🎉 Coupon "${code}" copied to clipboard! Enjoy ₹7,500 off.`);
      }).catch(() => {
        showToast(`🎉 Use code "${code}" for ₹7,500 off!`);
      });
    });
  }
}

window.showToast = function(msg) {
  let toast = document.getElementById('globalToastNotice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToastNotice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fa-solid fa-bell" style="color: #ff7043; font-size: 1.2rem;"></i> <span>${msg}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
};

/* =========================================================================
   7. PACKAGES PAGE FILTERING & SORTING ENGINE (PACKAGES.HTML)
   ========================================================================= */
function initPackagesFilter() {
  const searchInput = document.getElementById('packageSearchInput');
  const priceRange = document.getElementById('pkgPriceRange');
  const priceDisplay = document.getElementById('pkgPriceDisplay');
  const countDisplay = document.getElementById('packagesCountNum');
  const sortSelect = document.getElementById('packageSortSelect');
  const resetBtn = document.getElementById('resetFiltersBtn');

  const packageCards = document.querySelectorAll('.package-card-item');

  function applyFilters() {
    let count = 0;
    const query = searchInput?.value.toLowerCase().trim() || '';
    const maxPrice = priceRange ? Number(priceRange.value) : 200000;

    // Checked Regions
    const checkedRegions = Array.from(document.querySelectorAll('input[name="region"]:checked')).map(cb => cb.value);
    // Checked Durations
    const checkedDurations = Array.from(document.querySelectorAll('input[name="duration"]:checked')).map(cb => cb.value);
    // Checked Themes
    const checkedThemes = Array.from(document.querySelectorAll('input[name="theme"]:checked')).map(cb => cb.value);

    packageCards.forEach(card => {
      const title = card.getAttribute('data-title')?.toLowerCase() || '';
      const dest = card.getAttribute('data-destination')?.toLowerCase() || '';
      const price = Number(card.getAttribute('data-price') || 0);
      const region = card.getAttribute('data-region') || '';
      const duration = card.getAttribute('data-duration') || '';
      const theme = card.getAttribute('data-theme') || '';

      const matchQuery = !query || title.includes(query) || dest.includes(query);
      const matchPrice = price <= maxPrice;
      const matchRegion = checkedRegions.length === 0 || checkedRegions.includes(region);
      const matchDuration = checkedDurations.length === 0 || checkedDurations.includes(duration);
      const matchTheme = checkedThemes.length === 0 || checkedThemes.includes(theme);

      if (matchQuery && matchPrice && matchRegion && matchDuration && matchTheme) {
        card.style.display = 'flex';
        count++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countDisplay) countDisplay.textContent = count;
  }

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (priceRange) {
    priceRange.addEventListener('input', (e) => {
      if (priceDisplay) priceDisplay.textContent = `₹${Number(e.target.value).toLocaleString('en-IN')}`;
      applyFilters();
    });
  }

  document.querySelectorAll('input[name="region"], input[name="duration"], input[name="theme"]').forEach(cb => {
    cb.addEventListener('change', applyFilters);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (priceRange) {
        priceRange.value = 150000;
        if (priceDisplay) priceDisplay.textContent = '₹1,50,000';
      }
      document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
      applyFilters();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      const sortType = e.target.value;
      const grid = document.getElementById('packagesGridContainer');
      if (!grid) return;

      const cardsArray = Array.from(packageCards);
      cardsArray.sort((a, b) => {
        const priceA = Number(a.getAttribute('data-price') || 0);
        const priceB = Number(b.getAttribute('data-price') || 0);
        const durA = Number(a.getAttribute('data-days') || 0);
        const durB = Number(b.getAttribute('data-days') || 0);

        if (sortType === 'price-low') return priceA - priceB;
        if (sortType === 'price-high') return priceB - priceA;
        if (sortType === 'duration-low') return durA - durB;
        if (sortType === 'duration-high') return durB - durA;
        return 0; // Default popularity
      });

      cardsArray.forEach(c => grid.appendChild(c));
    });
  }
}

/* =========================================================================
   8. CONTACT & AGENT REGISTRATION FORMS (CONTACT.HTML)
   ========================================================================= */
function initContactForms() {
  const travelerContactForm = document.getElementById('travelerContactForm');
  const agentPartnerForm = document.getElementById('agentPartnerForm');

  if (travelerContactForm) {
    travelerContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('📩 Thank you! Your travel inquiry has been received. Our concierge will call within 15 minutes.');
      travelerContactForm.reset();
    });
  }

  if (agentPartnerForm) {
    agentPartnerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('🤝 Partner registration submitted! Our Travel Agent Onboarding Team will verify your agency within 24 hours.');
      agentPartnerForm.reset();
    });
  }
}

/* =========================================================================
   9. COMPREHENSIVE TOUR PACKAGE CARD CLICK & ITINERARY MODAL
   ========================================================================= */
const PACKAGES_DATA = {
  'kashmir': {
    title: 'Enchanting Kashmir with Dal Lake Houseboat & Gulmarg Gondola',
    destination: 'Srinagar • Gulmarg • Pahalgam',
    duration: '6 Days / 5 Nights',
    price: '₹14,999',
    rating: '4.9 ★ (1,840 reviews)',
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
    overview: 'Experience the magic of Kashmir with this best-selling 6-day holiday. Stay in a traditional carved walnut luxury houseboat on Dal Lake, take a scenic Shikara ride, experience the world-famous Gulmarg Gondola cable car up into the snow-capped Apharwat peaks, and explore the breathtaking valleys of Betaab and Aru in Pahalgam.',
    hotels: '3 Nights Srinagar 4★ (Hotel Pine Spring / The Grand Mamta), 1 Night Luxury Dal Lake Houseboat, 1 Night Gulmarg (Hotel Hilltop / Heevan Retreat)',
    vehicle: 'Private Sanitized AC Sedan / Innova Crysta for all transfers and sightseeing with verified local driver',
    inclusions: [
      '5 Nights accommodation in handpicked 4★ hotels and luxury houseboat',
      'Daily buffet breakfast and multi-course Indian dinners included',
      'Private dedicated AC cab from Srinagar airport pick-up to drop-off',
      '1 Hour complimentary traditional Shikara ride on Dal Lake',
      'Gulmarg Gondola Phase 1 priority ticket coordination',
      'All toll taxes, parking fees, driver allowances, and fuel charges'
    ],
    exclusions: [
      'Airfare / Train tickets (available on request with wholesale agent discounts)',
      'Union cab in Pahalgam (Aru/Betaab valley) as per local union rules',
      'Personal expenses, laundry, tips, and pony rides'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Arrival in Srinagar & Sunset Shikara Ride', desc: 'Arrive at Srinagar airport where your private chauffeur welcomes you. Transfer to your luxury Dal Lake Houseboat. In the evening, enjoy a 1-hour relaxing Shikara ride across floating gardens and Dal Lake lotus zones.', perks: 'Houseboat Stay • Dinner Included • Shikara Ride' },
      { day: 'Day 2', title: 'Srinagar to Gulmarg "Meadow of Flowers"', desc: 'Drive through apple orchards and pine forests to Gulmarg (2,730m). Board the Gulmarg Gondola (Asia\'s highest cable car) up to Kongdoori / Apharwat peaks for snow activities, skiing, and panoramic Himalayan views.', perks: 'Gondola Ride • Snow Point • Mountain Hotel' },
      { day: 'Day 3', title: 'Gulmarg to Pahalgam "Valley of Shepherds"', desc: 'Morning drive to Pahalgam via the saffron fields of Pampore and Awantipora temple ruins. Check-in at riverside resort in Pahalgam. Walk along the glistening Lidder River in the evening.', perks: 'Scenic River Resort • Saffron Fields' },
      { day: 'Day 4', title: 'Pahalgam Excursions: Betaab Valley & Aru Valley', desc: 'Full day sightseeing of Pahalgam\'s iconic valleys. Visit Betaab Valley (famous for Bollywood film shoots), Aru Valley wildlife sanctuary, and Chandanwari (starting point of Amarnath Yatra).', perks: 'Betaab Valley • Aru Valley • AC Cab' },
      { day: 'Day 5', title: 'Pahalgam to Srinagar & Mughal Gardens Tour', desc: 'Return to Srinagar. Visit the UNESCO heritage Mughal Gardens: Nishat Bagh (Garden of Pleasure), Shalimar Bagh, and Chashme Shahi. In the evening, explore local Lal Chowk markets for Pashmina shawls and dry fruits.', perks: 'Mughal Gardens • Shopping • 4★ Hotel' },
      { day: 'Day 6', title: 'Departure with Lifetime Memories', desc: 'Enjoy breakfast with views of Dal Lake. Your driver transfers you to Srinagar airport for your onward journey with unforgettable memories of Paradise on Earth.', perks: 'Airport Transfer • Breakfast Included' }
    ]
  },
  'dubai': {
    title: 'Dubai Glitz & Glam: Burj Khalifa 124th Floor + Desert Safari & Marina Cruise',
    destination: 'Dubai Downtown • Marina • Desert',
    duration: '5 Days / 4 Nights',
    price: '₹28,999',
    rating: '5.0 ★ (2,120 reviews)',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    overview: 'A dream Dubai getaway combining futuristic city landmarks with Arabian heritage. Ascend to the 124th floor of the world\'s tallest tower Burj Khalifa, enjoy thrilling 4x4 dune bashing in the golden desert with live belly dance and BBQ dinner, and sail past glittering skyscrapers on a luxury Marina Dhow cruise.',
    hotels: '4 Nights in 4-Star Downtown Dubai Hotel (Citymax Al Barsha / Holiday Inn Downtown)',
    vehicle: 'Private AC transfers for airport & city tour, shared 4x4 Land Cruiser for Desert Safari',
    inclusions: [
      '4 Nights stay in 4-Star city-center hotel with daily buffet breakfast',
      'Burj Khalifa 124th Floor observation deck tickets at prime non-peak slots',
      'Desert Safari with 4x4 Dune Bashing, Tanoura show, Fire dance & BBQ buffet dinner',
      'Dubai Marina Luxury Dhow Cruise with international 5-star buffet dinner & music',
      'Half-day Dubai city orientation tour covering Jumeirah Beach & Palm Atlantis',
      'Return Dubai International Airport transfers with meet & greet'
    ],
    exclusions: [
      'Tourism Dirham tax payable directly at hotel check-in (~AED 15/room/night)',
      'UAE Tourist Visa & OK to Board (can be added for ₹1,499)',
      'Any optional rides like quad biking in desert or helicopter flight'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Arrival in Dubai & Marina Dhow Cruise Dinner', desc: 'Land in Dubai where our representative greets you and transfers you to your hotel. In the evening, board a luxury illuminated Dhow cruise in Dubai Marina with spectacular skyline views, buffet dinner, and live Tanoura performance.', perks: 'Airport Pickup • Marina Cruise • Buffet Dinner' },
      { day: 'Day 2', title: 'Half Day City Tour & Burj Khalifa 124th Floor', desc: 'Tour Dubai Creek, Gold Souk, Jumeirah Mosque, and Palm Jumeirah with photo stops at Atlantis The Palm. Afternoon visit to Dubai Mall and take high-speed elevators to Burj Khalifa 124th floor for 360-degree vistas.', perks: 'Burj Khalifa Tickets • Dubai Mall • City Tour' },
      { day: 'Day 3', title: 'Desert Safari with Dune Bashing & BBQ Night', desc: 'Morning at leisure for shopping. Around 3:00 PM, 4x4 Land Cruisers pick you up for thrilling dune bashing across red sands. Enjoy camel rides, henna tattoos, belly dancing, and a feast under the stars.', perks: '4x4 Dune Bashing • BBQ Buffet • Cultural Shows' },
      { day: 'Day 4', title: 'Miracle Garden & Global Village (Seasonal)', desc: 'Explore the world\'s largest natural flower garden with 150 million blooming flowers, followed by an evening visit to Global Village showcasing pavilions from 90+ countries with street food and shopping.', perks: 'Miracle Garden • Global Village • Private Cab' },
      { day: 'Day 5', title: 'Last-Minute Shopping & Airport Departure', desc: 'Check-out after breakfast. Spend your morning shopping at Meena Bazaar or Mall of the Emirates before your private transfer to Dubai International Airport.', perks: 'Airport Drop-off • Breakfast Included' }
    ]
  },
  'bali': {
    title: 'Bali Tropical Romance with Private Pool Villa & Watersports',
    destination: 'Kuta Beach • Ubud • Tanjung Benoa',
    duration: '5 Days / 4 Nights',
    price: '₹22,999',
    rating: '4.9 ★ (1,580 reviews)',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    overview: 'The quintessential Indonesian getaway combining vibrant beach life in Kuta with lush jungle serenity in Ubud. Stay in a private pool villa, soar high over rice terraces on the Bali Swing, indulge in adrenaline watersports at Tanjung Benoa, and witness dramatic clifftop sunsets at Uluwatu Temple.',
    hotels: '2 Nights 4-Star Kuta Beach Resort + 2 Nights Ubud Private Pool Villa (Dedary Kriyamaha / Kawi Resort)',
    vehicle: 'Private Dedicated AC vehicle with English-speaking Balinese driver for all days',
    inclusions: [
      '2 Nights in 4★ Kuta hotel + 2 Nights in Luxury Private Pool Villa in Ubud',
      'Daily floating or buffet breakfast, plus 1 candlelight Indian dinner in villa',
      'Tanjung Benoa Watersports: Parasailing, Banana Boat, and Jet Ski adventure',
      'Ubud Tour: Tegalalang Rice Terraces, Monkey Forest, and famous Bali Giant Swing pass',
      'Uluwatu Clifftop Temple Tour with dramatic ocean sunset views',
      'Dedicated private AC car with certified chauffeur throughout Bali'
    ],
    exclusions: [
      'Indonesia Tourist Visa On Arrival (~$35 USD payable at airport)',
      'Bali Tourist Levy (~$10 USD)',
      'Lunches and personal shopping expenses'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Arrival in Denpasar & Check-in at Kuta Beach', desc: 'Arrive at Ngurah Rai International Airport. Meet your private driver who welcomes you with a traditional flower garland. Transfer to your Kuta resort and spend the evening enjoying beachside cafes.', perks: 'Airport Pickup • Flower Garland • Beach Resort' },
      { day: 'Day 2', title: 'Tanjung Benoa Watersports & Uluwatu Sunset', desc: 'Head to the golden sands of Tanjung Benoa for thrilling water sports: flying high on parasailing and riding banana boats. Late afternoon visit to dramatic Uluwatu Temple perched on a 70m ocean cliff.', perks: 'Watersports Pack • Uluwatu Temple • Sunset' },
      { day: 'Day 3', title: 'Transfer to Ubud via Celuk & Ubud Giant Swing', desc: 'Check-out from Kuta and drive towards cultural Ubud. Visit Celuk silver artisans, coffee plantations with Luwak coffee tasting, and enjoy the famous Bali Giant Jungle Swing overlooking emerald rice terraces.', perks: 'Giant Swing Pass • Coffee Tasting • Check-in Pool Villa' },
      { day: 'Day 4', title: 'Ubud Sightseeing: Tegenungan Waterfall & Candlelight Dinner', desc: 'Explore the stunning Tegenungan Waterfall and Monkey Forest Sanctuary. In the evening, enjoy a special romantic candlelight dinner in your private pool villa with flower petals.', perks: 'Waterfall Trek • Monkey Forest • Candlelight Dinner' },
      { day: 'Day 5', title: 'Ubud Market Shopping & Departure', desc: 'Enjoy a lazy floating breakfast in your private pool. Visit Ubud Art Market for souvenirs before your chauffeur transfers you to Denpasar Airport for your return flight.', perks: 'Floating Breakfast • Airport Transfer' }
    ]
  },
  'kerala': {
    title: 'Kerala God\'s Own Country: Munnar Tea Hills & Private Houseboat Cruise',
    destination: 'Cochin • Munnar • Thekkady • Alleppey',
    duration: '5 Days / 4 Nights',
    price: '₹12,499',
    rating: '4.8 ★ (1,340 reviews)',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    overview: 'Immerse yourself in tranquil emerald landscapes, mist-shrouded tea gardens, spice plantations, and serene backwater canals. Complete with an overnight stay on a traditional thatched-roof private deluxe houseboat in Alleppey with freshly prepared Kerala delicacies.',
    hotels: '2 Nights Munnar 4★ (Tea County / Blanket Hotel), 1 Night Thekkady (Elephant Court), 1 Night Alleppey Deluxe Houseboat',
    vehicle: 'Private AC Sedan / Innova Crysta for all 5 days with chauffeur',
    inclusions: [
      '4 Nights accommodation including 1 night on a private deluxe AC houseboat',
      'All meals on houseboat (Lunch, High Tea, Dinner, Breakfast) + Daily hotel breakfasts',
      'Sightseeing of Cheeyappara & Valara waterfalls, Mattupetty Dam & Tea Museum',
      'Thekkady spice plantation guided tour with elephant interaction',
      'Private AC vehicle for all transfers, tolls, and intercity sightseeing'
    ],
    exclusions: [
      'Periyar lake boat safari entry tickets',
      'Kathakali & Kalaripayattu martial arts cultural show passes (can be added for ₹400)',
      'Any camera or monument entrance charges'
    ],
    itinerary: [
      { day: 'Day 1', title: 'Cochin Arrival & Scenic Drive to Munnar', desc: 'Meet your chauffeur at Cochin airport/railway station. Drive through rubber plantations and stop at Cheeyappara and Valara waterfalls. Check in at your hillside resort in Munnar.', perks: 'Waterfall Halts • Tea Valley Resort' },
      { day: 'Day 2', title: 'Munnar Tea Gardens & Mattupetty Excursion', desc: 'Full day exploring Eravikulam National Park (home to Nilgiri Tahr), Tata Tea Museum, Mattupetty Dam, and Echo Point. Enjoy a fresh cardamom tea tasting in the evening.', perks: 'Eravikulam Park • Tea Museum • Boating' },
      { day: 'Day 3', title: 'Munnar to Thekkady Spice Sanctuary', desc: 'Drive to Thekkady. Tour aromatic cardamom, pepper, and cinnamon plantations. Take a boat safari in Periyar Lake to spot wild elephants and sambar deer in their natural habitat.', perks: 'Spice Plantation • Periyar Boat Ride' },
      { day: 'Day 4', title: 'Thekkady to Alleppey Houseboat Backwaters', desc: 'Drive to Alleppey and check-in to your private deluxe houseboat at 12 PM. Cruise through palm-fringed canals, paddy fields, and backwater villages while savoring authentic Kerala cuisine.', perks: 'Private Houseboat • All Meals Included • Backwaters' },
      { day: 'Day 5', title: 'Alleppey to Cochin Departure', desc: 'Enjoy breakfast on the water as the houseboat docks. Transfer to Cochin airport or railway station with sweet memories of God\'s Own Country.', perks: 'Airport Transfer • Breakfast Included' }
    ]
  },
  'goa': {
    title: 'Vibrant Goa Holiday with Beachfront Resort & Scuba Diving Combo',
    destination: 'North Goa • South Goa • Mandovi',
    duration: '4 Days / 3 Nights',
    price: '₹8,499',
    rating: '4.9 ★ (2,890 reviews)',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    overview: 'The ultimate beach getaway featuring beachfront resort stays, thrilling scuba diving at Grand Island with HD underwater video, and a luxury Mandovi River DJ dinner cruise under the stars.',
    hotels: '3 Nights in 4-Star Beach Resort (Resort Rio / Whispering Palms / Hard Rock Hotel)',
    vehicle: 'Private AC Car for sightseeing & airport/railway station transfers',
    inclusions: [
      '3 Nights in 4★ resort with swimming pool & complimentary buffet breakfasts',
      'Grand Island Scuba Diving trip with PADI instructor & free underwater video clip',
      'Mandovi River Luxury DJ Sunset Dinner Cruise ticket pass',
      'North Goa sightseeing: Fort Aguada, Baga Beach, Anjuna flea market',
      'South Goa sightseeing: Basilica of Bom Jesus, Mangueshi Temple, Miramar beach'
    ],
    exclusions: ['Beverages and personal shopping', 'Water sports at Baga (optional on spot)'],
    itinerary: [
      { day: 'Day 1', title: 'Arrival in Goa & Evening at Baga Beach', desc: 'Transfer from airport/station to resort. Relax by the pool, then head to Baga Beach and Tito\'s Lane for sunset views and vibrant seaside shacks.', perks: 'Beach Resort • Pool Access' },
      { day: 'Day 2', title: 'Grand Island Scuba Diving & Dolphin Sightings', desc: 'Boat trip to Grand Island. Enjoy guided scuba diving with certified instructors, spot dolphins in the Arabian Sea, and relish an island buffet lunch.', perks: 'Scuba Diving • Underwater Video • Dolphin Watch' },
      { day: 'Day 3', title: 'South Goa Heritage & Mandovi Dinner Cruise', desc: 'Visit Old Goa churches (Basilica of Bom Jesus), historic Latin Quarter of Fontainhas, and board an evening luxury cruise on Mandovi River with live DJ and folk dance.', perks: 'Heritage Tour • Mandovi DJ Cruise • Dinner' },
      { day: 'Day 4', title: 'Fort Aguada & Departure', desc: 'Visit the Portuguese Fort Aguada overlooking the Arabian Sea before your chauffeur transfers you to Goa airport/station for departure.', perks: 'Fort Aguada • Airport Drop-off' }
    ]
  },
  'thailand': {
    title: 'Exotic Thailand: Phuket & Krabi with Speedboat Phi Phi Tour',
    destination: 'Phuket • Phi Phi Island • Krabi',
    duration: '6 Days / 5 Nights',
    price: '₹21,499',
    rating: '4.8 ★ (1,740 reviews)',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
    overview: 'A high-energy island getaway taking you from the vibrant shores of Phuket to the dramatic limestone karsts of Krabi. Cruise on high-speed boats to Maya Bay (The Beach movie spot) and snorkel in crystal-clear emerald waters.',
    hotels: '3 Nights Phuket (Ashlee Plaza / Deevana Patong) + 2 Nights Krabi (Aonang Princeville / Centara)',
    vehicle: 'Private AC transfers and shared speedboat tours with licensed guides',
    inclusions: [
      '5 Nights in 4-Star beach resorts with daily buffet breakfast',
      'Speedboat tour to Phi Phi Islands, Maya Bay, Viking Cave & Monkey Beach with lunch',
      'Krabi 4 Islands tour by speed boat: Phra Nang Cave, Chicken Island, Tup Island',
      'Intercity road/ferry transfer between Phuket and Krabi',
      'Roundtrip airport transfers in private AC vehicle'
    ],
    exclusions: ['Thailand National Park fees (~400 THB/person on island tours)', 'Visa (Visa Free for Indians)'],
    itinerary: [
      { day: 'Day 1', title: 'Phuket Arrival & Patong Nightlife', desc: 'Arrive at Phuket airport and transfer to hotel. Evening at leisure on Patong Beach and Bangla Road.', perks: 'Airport Transfer • Patong Stay' },
      { day: 'Day 2', title: 'Full Day Phi Phi Islands by Speedboat', desc: 'Speedboat cruise to legendary Phi Phi Don, Phi Phi Leh, and Maya Bay. Snorkel among coral reefs and enjoy a beachside lunch.', perks: 'Speedboat Cruise • Snorkeling Gear • Lunch' },
      { day: 'Day 3', title: 'Phuket to Krabi Transfer via Phang Nga', desc: 'Scenic journey from Phuket to Krabi. Check-in to your resort in Ao Nang Beach with stunning limestone cliff backdrops.', perks: 'Scenic Transfer • Ao Nang Resort' },
      { day: 'Day 4', title: 'Krabi 4 Islands Island Hopping Tour', desc: 'Visit Koh Poda, Tup Island (where a sandbank connects two islands at low tide), Chicken Island, and Princess Cave.', perks: '4 Islands Tour • Sandbank Walk • Picnic' },
      { day: 'Day 5', title: 'Krabi Leisure & Sunset Dining', desc: 'Free day for relaxing, Thai massage, rock climbing in Railay beach, or dining at hilltop sunset restaurants.', perks: 'Free Day • Beach Relaxation' },
      { day: 'Day 6', title: 'Departure from Krabi Airport', desc: 'Transfer to Krabi International Airport for your flight back home.', perks: 'Airport Transfer • Breakfast Included' }
    ]
  },
  'rajasthan': {
    title: 'Royal Rajasthan Heritage: Amber Fort, Lake Pichola & Heritage Haveli',
    destination: 'Jaipur • Jodhpur • Udaipur',
    duration: '5 Days / 4 Nights',
    price: '₹13,800',
    rating: '4.9 ★ (1,490 reviews)',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    overview: 'Experience the grandeur of Maharajas with royal fortresses, palatial courtyards, and mirror-work havelis across the Golden Triangle of Rajasthan.',
    hotels: '2 Nights Jaipur Heritage Hotel + 2 Nights Udaipur Lake View Hotel',
    vehicle: 'Private AC Innova Crysta throughout with royal chauffeur',
    inclusions: [
      '4 Nights in authentic heritage hotels with daily royal breakfasts',
      'Full-day Jaipur fort tour: Amber Fort, Hawa Mahal, Jantar Mantar, City Palace',
      'Scenic drive via Pushkar Brahma Temple & Ajmer Dargah',
      'Boat cruise on Lake Pichola in Udaipur with views of Jag Mandir & Taj Lake Palace',
      'Dedicated AC vehicle covering all highway tolls, parking, and driver allowances'
    ],
    exclusions: ['Monument entry camera tickets', 'Optional elephant/jeep ride at Amber Fort'],
    itinerary: [
      { day: 'Day 1', title: 'Jaipur Arrival & Chokhi Dhani Cultural Village', desc: 'Chauffeur pickup in Jaipur. Check in at heritage hotel. Evening visit to Chokhi Dhani for Rajasthani folk dance and traditional thali dinner.', perks: 'Heritage Hotel • Cultural Dinner' },
      { day: 'Day 2', title: 'Jaipur Pink City & Amber Fort Grand Tour', desc: 'Explore the majestic Amber Fort atop the Aravalli hills, stop for photos at Jal Mahal and Hawa Mahal, and visit City Palace museum.', perks: 'Amber Fort • City Palace • Hawa Mahal' },
      { day: 'Day 3', title: 'Jaipur to Udaipur via Holy Pushkar Lake', desc: 'Drive to the Romantic Lake City Udaipur. Stop at Pushkar to visit the only Brahma Temple in the world. Check in at Udaipur hotel overlooking the lake.', perks: 'Pushkar Lake • Brahma Temple • Lake View Hotel' },
      { day: 'Day 4', title: 'Udaipur City Palace & Lake Pichola Boat Cruise', desc: 'Tour Udaipur\'s grand City Palace complex, Saheliyon Ki Bari royal gardens, and take a sunset boat ride across tranquil Lake Pichola.', perks: 'City Palace • Lake Pichola Boat Cruise' },
      { day: 'Day 5', title: 'Udaipur Departure', desc: 'Transfer to Udaipur airport or railway station for onward departure.', perks: 'Airport Transfer • Breakfast Included' }
    ]
  },
  'andaman': {
    title: 'Pristine Andaman Islands: Havelock Radhanagar Beach & Scuba Tour',
    destination: 'Port Blair • Havelock • Neil Island',
    duration: '5 Days / 4 Nights',
    price: '₹17,999',
    rating: '4.9 ★ (1,180 reviews)',
    image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80',
    overview: 'Turquoise ocean water, white sand beaches, and thriving coral reefs. Travel between islands aboard high-speed luxury catamaran ferries and visit Radhanagar Beach, rated the best beach in Asia.',
    hotels: '2 Nights Port Blair (Symphony Palms / Fortune Resort) + 2 Nights Havelock (Havelock Island Beach Resort)',
    vehicle: 'Private AC vehicles for all island transfers & luxury Makruzz Catamaran ferry tickets',
    inclusions: [
      '4 Nights in 4★ beachside resorts with daily breakfast',
      'Makruzz High-Speed AC Catamaran tickets (Port Blair <-> Havelock)',
      'Radhanagar Beach (Beach No. 7) sunset excursion',
      'Elephant Beach speedboat excursion with complimentary snorkeling',
      'Cellular Jail Light & Sound historical show in Port Blair'
    ],
    exclusions: ['Personal watersports like Sea Walk or deep Scuba (can be pre-booked at ₹3,500)', 'Lunches & dinners'],
    itinerary: [
      { day: 'Day 1', title: 'Port Blair Arrival & Cellular Jail Light Show', desc: 'Meet our representative at Veer Savarkar Airport. Check-in to resort, visit historic Cellular Jail and witness the poignant Light and Sound show.', perks: 'Airport Pickup • Cellular Jail Show' },
      { day: 'Day 2', title: 'Catamaran to Havelock & Radhanagar Sunset', desc: 'Board the Makruzz catamaran ferry to Havelock Island. Afternoon visit to Radhanagar Beach, ranked among Asia\'s top 7 beaches, for a memorable golden sunset.', perks: 'Makruzz Ferry • Radhanagar Beach' },
      { day: 'Day 3', title: 'Elephant Beach Coral Reef Snorkeling', desc: 'Speedboat ride to Elephant Beach for water activities. Enjoy crystal clear waters with a complimentary guided snorkeling session to see vibrant coral reefs.', perks: 'Speedboat • Snorkeling Session • Coral Reef' },
      { day: 'Day 4', title: 'Havelock to Port Blair & Souvenir Shopping', desc: 'Return by cruise to Port Blair. Visit Sagarika Emporium for genuine seashell handicrafts and pearls.', perks: 'Cruise Return • Shopping Tour' },
      { day: 'Day 5', title: 'Departure from Port Blair', desc: 'Transfer to Port Blair airport for departure with incredible memories of the Andaman seas.', perks: 'Airport Transfer • Breakfast Included' }
    ]
  }
};

window.PACKAGES_DATA = PACKAGES_DATA;

function initPackageDetailModal() {
  // Attach click handler to package cards
  document.querySelectorAll('.package-card').forEach(card => {
    // Determine package ID
    const title = card.querySelector('.package-title')?.textContent?.toLowerCase() || '';
    const dest = card.getAttribute('data-destination')?.toLowerCase() || '';
    let pkgKey = 'kashmir';
    if (title.includes('dubai') || dest.includes('dubai')) pkgKey = 'dubai';
    else if (title.includes('bali') || dest.includes('bali')) pkgKey = 'bali';
    else if (title.includes('kerala') || dest.includes('kerala')) pkgKey = 'kerala';
    else if (title.includes('goa') || dest.includes('goa')) pkgKey = 'goa';
    else if (title.includes('thailand') || dest.includes('thailand')) pkgKey = 'thailand';
    else if (title.includes('rajasthan') || dest.includes('rajasthan')) pkgKey = 'rajasthan';
    else if (title.includes('andaman') || dest.includes('andaman')) pkgKey = 'andaman';

    card.setAttribute('data-package-key', pkgKey);
    card.style.cursor = 'pointer';

    // Clicking anywhere on the card opens dedicated package-detail.html page
    card.addEventListener('click', (e) => {
      // If clicking directly on the quote button, open quote modal
      if (e.target.closest('.btn-get-quote')) {
        return;
      }
      openPackageDetail(pkgKey);
    });

    // If card doesn't have "Details" button yet, inject it nicely
    const footer = card.querySelector('.package-footer');
    if (footer && !footer.querySelector('.btn-view-package')) {
      const viewBtn = document.createElement('a');
      viewBtn.className = 'btn-view-package';
      viewBtn.href = `package-detail.html?pkg=${encodeURIComponent(pkgKey)}`;
      viewBtn.innerHTML = '<i class="fa-solid fa-eye"></i> Details';
      viewBtn.addEventListener('click', (ev) => {
        ev.stopPropagation();
      });
      // Insert before get quote button
      const quoteBtn = footer.querySelector('.btn-get-quote');
      if (quoteBtn) {
        footer.insertBefore(viewBtn, quoteBtn);
      }
    }
  });
}

function createPackageModalDOM() {
  if (document.getElementById('packageDetailsModal')) return;

  const modalHtml = `
    <div class="modal-overlay" id="packageDetailsModal">
      <div class="package-detail-modal-card">
        <button class="modal-close-btn" id="pkgModalCloseBtn" style="position: absolute; top: 16px; right: 16px; z-index: 20; background: rgba(0,0,0,0.6);" aria-label="Close">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <div class="pkg-modal-hero">
          <img src="" id="pkgModalImg" class="pkg-modal-hero-img" alt="Package Destination">
          <div class="pkg-modal-hero-overlay">
            <div class="pkg-modal-badges">
              <span class="package-badge-tag" id="pkgModalBadge">Verified Itinerary</span>
              <span class="package-badge-tag secondary" id="pkgModalDuration"><i class="fa-regular fa-clock"></i> 6D/5N</span>
              <span class="package-badge-tag secondary" id="pkgModalRating">4.9 ★</span>
            </div>
            <h2 class="pkg-modal-title" id="pkgModalTitle">Package Title</h2>
            <div class="pkg-modal-meta-row">
              <div id="pkgModalDest" style="font-weight: 700;"><i class="fa-solid fa-location-dot" style="color: var(--ht-orange);"></i> Destination</div>
              <div class="pkg-modal-price-tag" id="pkgModalPrice">₹14,999 <span style="font-size: 0.8rem; color: #cbd5e1; font-weight: 600;">/ person</span></div>
            </div>
          </div>
        </div>

        <div class="pkg-modal-tabs-bar">
          <button class="pkg-modal-tab-btn active" data-tab="tab-itinerary"><i class="fa-solid fa-calendar-days"></i> Day-Wise Itinerary</button>
          <button class="pkg-modal-tab-btn" data-tab="tab-overview"><i class="fa-solid fa-circle-info"></i> Highlights & Hotels</button>
          <button class="pkg-modal-tab-btn" data-tab="tab-inclusions"><i class="fa-solid fa-list-check"></i> Inclusions & Exclusions</button>
        </div>

        <div class="pkg-modal-body-scroll">
          <!-- Tab 1: Itinerary -->
          <div class="pkg-tab-content" id="tab-itinerary">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
              <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--primary);">Full Day-by-Day Schedule</h3>
              <span style="font-size: 0.8rem; color: #10b981; font-weight: 700;"><i class="fa-solid fa-circle-check"></i> 100% Customizable Itinerary</span>
            </div>
            <div class="itinerary-timeline" id="pkgModalItineraryTimeline"></div>
          </div>

          <!-- Tab 2: Overview & Hotels -->
          <div class="pkg-tab-content" id="tab-overview" style="display: none;">
            <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--primary); margin-bottom: 12px;">Trip Overview</h3>
            <p id="pkgModalOverviewText" style="color: var(--text-muted); font-size: 0.96rem; line-height: 1.7; margin-bottom: 24px;"></p>

            <div style="background: #f8fafc; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 20px; margin-bottom: 20px;">
              <h4 style="font-size: 1rem; font-weight: 800; color: var(--primary); margin-bottom: 8px;"><i class="fa-solid fa-hotel" style="color: var(--ht-orange); margin-right: 8px;"></i> Handpicked Verified Accommodations</h4>
              <p id="pkgModalHotelsText" style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6;"></p>
            </div>

            <div style="background: #f8fafc; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 20px;">
              <h4 style="font-size: 1rem; font-weight: 800; color: var(--primary); margin-bottom: 8px;"><i class="fa-solid fa-car" style="color: var(--ht-orange); margin-right: 8px;"></i> Transport & Chauffeur</h4>
              <p id="pkgModalVehicleText" style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6;"></p>
            </div>
          </div>

          <!-- Tab 3: Inclusions & Exclusions -->
          <div class="pkg-tab-content" id="tab-inclusions" style="display: none;">
            <div class="inclusions-dual-grid">
              <div class="inclusion-box">
                <h4><i class="fa-solid fa-circle-check"></i> What's Included</h4>
                <ul class="in-ex-list" id="pkgModalInclusionsList"></ul>
              </div>
              <div class="exclusion-box">
                <h4><i class="fa-solid fa-circle-xmark"></i> What's Not Included</h4>
                <ul class="in-ex-list" id="pkgModalExclusionsList"></ul>
              </div>
            </div>
          </div>
        </div>

        <div class="pkg-modal-footer-cta">
          <div>
            <div style="font-size: 0.78rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Marketplace Guarantee</div>
            <div style="font-weight: 800; color: var(--primary); font-size: 0.95rem;"><i class="fa-solid fa-shield-halved" style="color: #10b981;"></i> 3 Verified Local Agents Will Bid on This Trip</div>
          </div>
          <div style="display: flex; gap: 10px;">
            <a href="https://wa.me/918048735999" target="_blank" class="btn btn-whatsapp btn-sm">
              <i class="fa-brands fa-whatsapp"></i> WhatsApp Expert
            </a>
            <button type="button" class="btn btn-primary btn-sm" id="pkgModalBookBtn">
              <i class="fa-solid fa-bolt"></i> Get 3 Quotes for This Package
            </button>
          </div>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // Close handlers
  const modal = document.getElementById('packageDetailsModal');
  const closeBtn = document.getElementById('pkgModalCloseBtn');
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  // Tab switching
  const tabs = document.querySelectorAll('.pkg-modal-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetId = tab.getAttribute('data-tab');
      document.querySelectorAll('.pkg-tab-content').forEach(c => c.style.display = 'none');
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.style.display = 'block';
    });
  });

  // Booking button inside package modal
  const bookBtn = document.getElementById('pkgModalBookBtn');
  if (bookBtn) {
    bookBtn.addEventListener('click', () => {
      const currentTitle = document.getElementById('pkgModalTitle')?.textContent || '';
      modal.classList.remove('active');
      openPlanTripModal({ destination: currentTitle });
    });
  }
}

window.openPackageDetail = function(packageKey) {
  window.location.href = `package-detail.html?pkg=${encodeURIComponent(packageKey || 'kashmir')}`;
};
