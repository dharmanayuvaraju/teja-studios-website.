// Teja Studios Official Website Logic
document.addEventListener('DOMContentLoaded', () => {
  initGallery();
  initReviews();
  initCalculator();
  initModals();
  initFaq();
  initMobileNav();
  initStickyHeader();
  initDatePickers();
});

// ==================== GALLERY SYSTEM (6 Initially, View 6 More, Category Filters) ====================
let displayedGalleryCount = 6;
let currentGalleryFilter = 'all';
let currentLightboxIndex = 0;
let currentFilteredGallery = [];

function initGallery() {
  const container = document.getElementById('galleryGrid');
  const tabs = document.querySelectorAll('.gallery-tab-btn');
  const viewMoreBtn = document.getElementById('viewMoreGalleryBtn');
  const showAllBtn = document.getElementById('showAllGalleryBtn');
  const collapseBtn = document.getElementById('collapseGalleryBtn');
  const countBadge = document.getElementById('galleryCountBadge');

  if (!container || !window.GALLERY_DATA) return;

  function getFilteredItems() {
    if (currentGalleryFilter === 'all') return window.GALLERY_DATA;
    return window.GALLERY_DATA.filter(it => it.category === currentGalleryFilter);
  }

  function renderGallery() {
    currentFilteredGallery = getFilteredItems();
    const visibleItems = currentFilteredGallery.slice(0, displayedGalleryCount);
    
    container.innerHTML = '';

    visibleItems.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = `gallery-card fade-in-card group relative cursor-pointer overflow-hidden rounded-2xl shadow-sm border border-slate-200/80 bg-slate-100 ${
        item.aspect === 'landscape' ? 'md:col-span-2' : ''
      }`;
      
      const badgeColor = {
        maternity: 'bg-amber-100/90 text-amber-900 border-amber-300/80',
        newborn: 'bg-rose-100/90 text-rose-900 border-rose-300/80',
        kids: 'bg-blue-100/90 text-blue-900 border-blue-300/80',
        cakesmash: 'bg-emerald-100/90 text-emerald-900 border-emerald-300/80'
      }[item.category] || 'bg-slate-100 text-slate-800 border-slate-200';

      card.innerHTML = `
        <div class="w-full ${item.aspect === 'landscape' ? 'h-64 sm:h-72 md:h-80' : 'h-72 sm:h-80 md:h-96'} overflow-hidden relative">
          <img 
            src="${item.file}" 
            alt="${item.title}" 
            loading="lazy" 
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          <!-- Category / Artistic Badge -->
          <div class="absolute top-3 left-3 z-10 flex items-center gap-1.5">
            <span class="text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md shadow-sm border ${badgeColor}">
              ${item.badge || 'Studio Set'}
            </span>
          </div>

          <!-- Overlay details -->
          <div class="overlay absolute inset-0 p-4 sm:p-6 flex flex-col justify-end text-white z-10 transition-opacity duration-300">
            <h4 class="font-serif text-base sm:text-lg font-bold tracking-wide">${item.title}</h4>
            <p class="text-[11px] sm:text-xs text-slate-200 line-clamp-2 mt-1 mb-3">${item.desc}</p>
            <div class="flex items-center justify-between gap-2">
              <span class="text-[11px] sm:text-xs text-amber-300 font-medium inline-flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
                Tap to inspect
              </span>
              <button 
                type="button"
                data-book-theme="${encodeURIComponent(item.title)}"
                class="book-theme-btn text-[11px] sm:text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-lg shadow transition-colors"
              >
                Book This Set
              </button>
            </div>
          </div>
        </div>
      `;

      card.addEventListener('click', (e) => {
        if (e.target.closest('.book-theme-btn')) {
          e.stopPropagation();
          const themeTitle = item.title;
          const url = `https://wa.me/919515109009?text=${encodeURIComponent(`Hi Teja Studios! I really love this theme from your website: "${themeTitle}". Is this set available for an upcoming shoot?`)}`;
          window.open(url, '_blank');
          return;
        }
        openLightbox(index);
      });

      container.appendChild(card);
    });

    // Update Counter badge
    if (countBadge) {
      countBadge.textContent = `Showing ${visibleItems.length} of ${currentFilteredGallery.length} Themes`;
    }

    // Button states
    const hasMore = visibleItems.length < currentFilteredGallery.length;
    if (viewMoreBtn) {
      if (hasMore) {
        viewMoreBtn.classList.remove('hidden');
        if (showAllBtn) showAllBtn.classList.remove('hidden');
      } else {
        viewMoreBtn.classList.add('hidden');
        if (showAllBtn) showAllBtn.classList.add('hidden');
      }
    }

    if (collapseBtn) {
      if (displayedGalleryCount > 6) {
        collapseBtn.classList.remove('hidden');
      } else {
        collapseBtn.classList.add('hidden');
      }
    }
  }

  // View 6 More Gallery Items
  if (viewMoreBtn) {
    viewMoreBtn.addEventListener('click', () => {
      displayedGalleryCount += 6;
      renderGallery();
    });
  }

  // Show All Gallery Items
  if (showAllBtn) {
    showAllBtn.addEventListener('click', () => {
      displayedGalleryCount = currentFilteredGallery.length;
      renderGallery();
    });
  }

  // Collapse back to 6
  if (collapseBtn) {
    collapseBtn.addEventListener('click', () => {
      displayedGalleryCount = 6;
      renderGallery();
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Filter Tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('bg-amber-500', 'text-slate-950', 'shadow-md');
        t.classList.add('bg-white', 'text-slate-600', 'hover:bg-slate-100');
      });
      tab.classList.add('bg-amber-500', 'text-slate-950', 'shadow-md');
      tab.classList.remove('bg-white', 'text-slate-600', 'hover:bg-slate-100');

      currentGalleryFilter = tab.dataset.filter || 'all';
      displayedGalleryCount = 6; // Reset to 6 for mobile friendliness!
      renderGallery();
    });
  });

  renderGallery();
}

// Lightbox for Gallery
function openLightbox(index) {
  const dialog = document.getElementById('lightboxModal');
  if (!dialog) return;
  currentLightboxIndex = index;
  updateLightboxContent();
  dialog.showModal();
}

function updateLightboxContent() {
  const item = currentFilteredGallery[currentLightboxIndex];
  if (!item) return;

  const img = document.getElementById('lightboxImg');
  const title = document.getElementById('lightboxTitle');
  const desc = document.getElementById('lightboxDesc');
  const counter = document.getElementById('lightboxCounter');
  const bookBtn = document.getElementById('lightboxBookBtn');

  if (img) img.src = item.file;
  if (title) title.textContent = item.title;
  if (desc) desc.textContent = item.desc;
  if (counter) counter.textContent = `${currentLightboxIndex + 1} / ${currentFilteredGallery.length}`;
  if (bookBtn) {
    bookBtn.onclick = () => {
      const msg = encodeURIComponent(`Hi Teja Studios, I am interested in booking a shoot session for the "${item.title}" theme. Please share slot availability!`);
      window.open(`https://wa.me/919515109009?text=${msg}`, '_blank');
    };
  }
}

// ==================== REVIEWS SYSTEM (4 Initially, View 6 More, Maps Redirect for Truncated) ====================
let displayedReviewsCount = 4; // Start with 4 reviews only
let currentReviewFilter = 'all';
const MAPS_REVIEWS_URL = 'https://www.google.com/maps/place/TEJA+STUDIOS/@17.5933003,78.4941827,17z/data=!4m8!3m7!1s0x3bcb85914736d049:0x6bcefe2770b2d69b!8m2!3d17.5933003!4d78.4941827!9m1!1b1!16s%2Fg%2F11x6rwd3b_';

function initReviews() {
  const container = document.getElementById('reviewsContainer');
  const viewMoreBtn = document.getElementById('viewMoreReviewsBtn');
  const showAllBtn = document.getElementById('showAllReviewsBtn');
  const collapseBtn = document.getElementById('collapseReviewsBtn');
  const reviewCountBadge = document.getElementById('reviewsCountBadge');
  const filterPills = document.querySelectorAll('.review-filter-pill');

  if (!container || !window.REVIEWS_DATA) return;

  function getFilteredReviews() {
    if (currentReviewFilter === 'all') return window.REVIEWS_DATA;
    return window.REVIEWS_DATA.filter(r => r.tags.includes(currentReviewFilter));
  }

  function renderReviews() {
    const list = getFilteredReviews();
    const visibleReviews = list.slice(0, displayedReviewsCount);
    
    container.innerHTML = '';

    visibleReviews.forEach(rev => {
      const card = document.createElement('div');
      card.className = 'bg-slate-50 border border-slate-200/90 rounded-2xl p-5 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative fade-in-card';

      const stars = '★'.repeat(rev.rating || 5);
      
      let truncatedHtml = '';
      if (rev.has_more) {
        truncatedHtml = `
          <div class="mt-3">
            <a 
              href="${MAPS_REVIEWS_URL}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-100/70 hover:bg-amber-200/80 px-3 py-1.5 rounded-lg border border-amber-300/60 transition-colors"
            >
              <span>Read Full Review on Google Maps</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>
          </div>
        `;
      }

      let ownerResponseHtml = '';
      if (rev.owner_response) {
        ownerResponseHtml = `
          <div class="mt-4 pt-3 border-t border-slate-200/70 bg-amber-50/50 -mx-5 -mb-5 sm:-mx-7 sm:-mb-7 p-4 sm:p-5 rounded-b-2xl">
            <div class="flex items-center gap-2 mb-1">
              <span class="w-2 h-2 rounded-full bg-amber-500"></span>
              <span class="text-[11px] font-bold text-amber-950 uppercase tracking-wide">Response from the Owner</span>
            </div>
            <p class="text-xs text-slate-700 leading-relaxed italic">
              "${rev.owner_response}"
            </p>
          </div>
        `;
      }

      card.innerHTML = `
        <div>
          <div class="flex items-start justify-between gap-2 mb-3">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-bold flex items-center justify-center text-xs shadow-sm">
                ${rev.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 class="font-bold text-sm text-slate-900 leading-tight">${rev.name}</h4>
                <span class="text-[11px] text-slate-500 block">${rev.badge || 'Verified Client'}</span>
              </div>
            </div>
            <div class="text-right">
              <div class="text-amber-500 text-xs">${stars}</div>
              <span class="text-[10px] text-slate-400 block mt-0.5">${rev.time || ''}</span>
            </div>
          </div>

          <p class="text-xs sm:text-sm text-slate-700 leading-relaxed mt-2.5">
            "${rev.text || 'Excellent photography studio and friendly team!'}"
          </p>

          ${truncatedHtml}
        </div>

        ${ownerResponseHtml}
      `;

      container.appendChild(card);
    });

    if (reviewCountBadge) {
      reviewCountBadge.textContent = `Showing ${visibleReviews.length} of ${list.length} Verified Reviews`;
    }

    const hasMore = visibleReviews.length < list.length;
    if (viewMoreBtn) {
      if (hasMore) {
        viewMoreBtn.classList.remove('hidden');
        if (showAllBtn) showAllBtn.classList.remove('hidden');
      } else {
        viewMoreBtn.classList.add('hidden');
        if (showAllBtn) showAllBtn.classList.add('hidden');
      }
    }

    if (collapseBtn) {
      if (displayedReviewsCount > 4) {
        collapseBtn.classList.remove('hidden');
      } else {
        collapseBtn.classList.add('hidden');
      }
    }
  }

  // View 6 More Reviews
  if (viewMoreBtn) {
    viewMoreBtn.addEventListener('click', () => {
      displayedReviewsCount += 6;
      renderReviews();
    });
  }

  // Show All Reviews
  if (showAllBtn) {
    showAllBtn.addEventListener('click', () => {
      displayedReviewsCount = getFilteredReviews().length;
      renderReviews();
    });
  }

  // Collapse back to 4
  if (collapseBtn) {
    collapseBtn.addEventListener('click', () => {
      displayedReviewsCount = 4;
      renderReviews();
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Filter Pills
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => {
        p.classList.remove('bg-amber-500', 'text-slate-950', 'shadow-sm');
        p.classList.add('bg-slate-100', 'text-slate-600', 'hover:bg-slate-200');
      });
      pill.classList.add('bg-amber-500', 'text-slate-950', 'shadow-sm');
      pill.classList.remove('bg-slate-100', 'text-slate-600', 'hover:bg-slate-200');

      currentReviewFilter = pill.dataset.filter || 'all';
      displayedReviewsCount = 4; // Reset to 4 on filter change
      renderReviews();
    });
  });

  renderReviews();
}

// Interactive Pricing & Estimate Calculator
function initCalculator() {
  const shootTypeSelect = document.getElementById('calcShootType');
  const durationSelect = document.getElementById('calcDuration');
  const addPhotographer = document.getElementById('calcPhotographer');
  const addVanity = document.getElementById('calcVanity');
  const totalAmountEl = document.getElementById('calcTotalAmount');
  const perHourRateEl = document.getElementById('calcPerHourRate');
  const whatsappBookBtn = document.getElementById('calcBookWhatsapp');

  if (!shootTypeSelect || !durationSelect || !totalAmountEl) return;

  function recalculate() {
    const hours = parseInt(durationSelect.value, 10) || 1;
    const basePrice = hours * 2500;

    let extras = 0;
    let extraNotes = [];
    if (addPhotographer && addPhotographer.checked) {
      extras += (hours * 1500);
      extraNotes.push('Include In-House Photographer');
    }
    if (addVanity && addVanity.checked) {
      extras += 500;
      extraNotes.push('Extended AC Vanity Suite time');
    }

    const total = basePrice + extras;
    totalAmountEl.textContent = `₹${total.toLocaleString('en-IN')}`;

    if (perHourRateEl) {
      perHourRateEl.textContent = `Base Rate: ₹2,500/hr`;
    }

    if (whatsappBookBtn) {
      const shootTypeName = shootTypeSelect.options[shootTypeSelect.selectedIndex].text;
      const durationText = durationSelect.options[durationSelect.selectedIndex].text;
      const extrasText = extraNotes.length ? `\n• Add-ons: ${extraNotes.join(', ')}` : '';
      
      const message = `Hello Teja Studios! 📸\nI would like to check availability and book a slot:\n• Shoot Type: ${shootTypeName}\n• Duration: ${durationText}\n• Estimated Total: ₹${total.toLocaleString('en-IN')}${extrasText}\n\nPlease confirm available dates & time slots!`;
      
      whatsappBookBtn.href = `https://wa.me/919515109009?text=${encodeURIComponent(message)}`;
    }
  }

  shootTypeSelect.addEventListener('change', recalculate);
  durationSelect.addEventListener('change', recalculate);
  if (addPhotographer) addPhotographer.addEventListener('change', recalculate);
  if (addVanity) addVanity.addEventListener('change', recalculate);

  recalculate();
}

// Dialog Modals (Lightbox & Quick Booking)
function initModals() {
  const lightbox = document.getElementById('lightboxModal');
  const bookingModal = document.getElementById('bookingModal');

  [lightbox, bookingModal].forEach(dialog => {
    if (!dialog) return;
    dialog.addEventListener('click', (e) => {
      const rect = dialog.getBoundingClientRect();
      const inDialog = (
        rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width
      );
      if (!inDialog) dialog.close();
    });
  });

  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  const closeBtn = document.getElementById('lightboxClose');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentLightboxIndex = (currentLightboxIndex - 1 + currentFilteredGallery.length) % currentFilteredGallery.length;
      updateLightboxContent();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentLightboxIndex = (currentLightboxIndex + 1) % currentFilteredGallery.length;
      updateLightboxContent();
    });
  }

  if (closeBtn && lightbox) {
    closeBtn.addEventListener('click', () => lightbox.close());
  }

  window.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.open) return;
    if (e.key === 'ArrowLeft') {
      currentLightboxIndex = (currentLightboxIndex - 1 + currentFilteredGallery.length) % currentFilteredGallery.length;
      updateLightboxContent();
    } else if (e.key === 'ArrowRight') {
      currentLightboxIndex = (currentLightboxIndex + 1) % currentFilteredGallery.length;
      updateLightboxContent();
    }
  });

  const openBookingBtns = document.querySelectorAll('.open-booking-modal-btn');
  const closeBookingBtn = document.getElementById('closeBookingModal');

  openBookingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (bookingModal) bookingModal.showModal();
    });
  });

  if (closeBookingBtn && bookingModal) {
    closeBookingBtn.addEventListener('click', () => bookingModal.close());
  }

  const bookingForm = document.getElementById('quickBookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('bookName').value || 'Guest';
      const phone = document.getElementById('bookPhone').value || '';
      const shootType = document.getElementById('bookType').value || 'Maternity/Baby';
      const date = document.getElementById('bookDate').value || 'Upcoming Date';
      const hours = document.getElementById('bookHours').value || '2 Hours';
      const note = document.getElementById('bookNotes').value || '';

      const msg = `Hello Teja Studios! 📸\nI would like to book a photography session:\n• Name: ${name}\n• Phone: ${phone}\n• Shoot Type: ${shootType}\n• Date Preferred: ${date}\n• Duration: ${hours}\n${note ? `• Note: ${note}\n` : ''}Please let me know if this slot is open!`;

      window.open(`https://wa.me/919515109009?text=${encodeURIComponent(msg)}`, '_blank');
      bookingModal.close();
    });
  }
}

// FAQ Accordion & 2-Item Mobile Toggle System
function initFaq() {
  const faqItems = document.querySelectorAll('.faq-item');
  const toggleBtn = document.getElementById('toggleFaqBtn');
  const toggleText = document.getElementById('toggleFaqText');
  const toggleIcon = document.getElementById('toggleFaqIcon');
  const extraFaqs = document.querySelectorAll('.faq-extra');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.accordion-content');
    const icon = item.querySelector('.faq-icon');

    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isOpen = content.classList.contains('open');

      faqItems.forEach(other => {
        const otherContent = other.querySelector('.accordion-content');
        const otherIcon = other.querySelector('.faq-icon');
        if (otherContent) otherContent.classList.remove('open');
        if (otherIcon) otherIcon.classList.remove('rotate-180');
      });

      if (!isOpen) {
        content.classList.add('open');
        if (icon) icon.classList.add('rotate-180');
      }
    });
  });

  // Toggle Extra FAQs (shows 2 initially, reveals +3 on click)
  if (toggleBtn && extraFaqs.length > 0) {
    let isFaqExpanded = false;
    toggleBtn.addEventListener('click', () => {
      isFaqExpanded = !isFaqExpanded;
      extraFaqs.forEach(faq => {
        if (isFaqExpanded) {
          faq.classList.remove('hidden');
          faq.classList.add('fade-in-card');
        } else {
          faq.classList.add('hidden');
          faq.classList.remove('fade-in-card');
          const content = faq.querySelector('.accordion-content');
          const icon = faq.querySelector('.faq-icon');
          if (content) content.classList.remove('open');
          if (icon) icon.classList.remove('rotate-180');
        }
      });

      if (toggleText) {
        toggleText.textContent = isFaqExpanded ? 'Show Fewer FAQs' : `View More FAQs (+${extraFaqs.length})`;
      }
      if (toggleIcon) {
        toggleIcon.classList.toggle('rotate-180', isFaqExpanded);
      }
    });
  }
}

// Mobile Hamburger Nav
function initMobileNav() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNavDrawer');
  const closeMobileNav = document.getElementById('closeMobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !mobileNav) return;

  function toggleMenu() {
    mobileNav.classList.toggle('hidden');
    document.body.classList.toggle('overflow-hidden');
  }

  menuBtn.addEventListener('click', toggleMenu);
  if (closeMobileNav) closeMobileNav.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    });
  });
}

// Sticky Header Blur
function initStickyHeader() {
  const header = document.getElementById('mainHeader');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('shadow-md', 'bg-white/95');
      header.classList.remove('bg-white/85');
    } else {
      header.classList.remove('shadow-md');
      header.classList.add('bg-white/85');
    }
  });
}

// Initialize Date Pickers with Today's Date
function initDatePickers() {
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('bookDate');
  if (dateInput) {
    dateInput.min = today;
    dateInput.value = today;
  }
}

// Copy to clipboard
window.copyToClipboard = function(text, successMsg) {
  navigator.clipboard.writeText(text).then(() => {
    const toast = document.getElementById('toastNotification');
    if (toast) {
      toast.textContent = successMsg || 'Copied to clipboard!';
      toast.classList.remove('opacity-0', 'translate-y-4');
      setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-4');
      }, 3000);
    }
  }).catch(() => {
    alert(text);
  });
};
