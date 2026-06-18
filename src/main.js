document.addEventListener('DOMContentLoaded', () => {

  // =========================================
  // 0. LANGUAGE MEMORY
  // =========================================
  const langLinks = document.querySelectorAll('.lang-pill-custom a');
  langLinks.forEach(link => {
    link.addEventListener('click', () => {
      const text = link.textContent.trim().toUpperCase();
      if (text === 'EN') {
        localStorage.setItem('preferredLang', 'en');
      } else if (text === 'DE') {
        localStorage.setItem('preferredLang', 'de');
      }
    });
  });

  // =========================================
  // 1. GLOBALE FUNKTIONEN (Laufen überall)
  // =========================================

  // --- Copyright Jahr ---
  const copyEl = document.getElementById('copyright-text');
  if (copyEl) {
    copyEl.innerHTML = `&copy; ${new Date().getFullYear()} Tom Ziegler. Alle Rechte vorbehalten.`;
  }

  // --- Scroll to Top Button ---
  const scrollToTopBtn = document.getElementById('scrollToTop');
  if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
      const shouldShow = window.scrollY > 300;
      scrollToTopBtn.style.opacity = shouldShow ? '1' : '0';
      scrollToTopBtn.style.pointerEvents = shouldShow ? 'auto' : 'none';
    });
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Loader Animation ---
  const loader = document.getElementById('loader');
  const bar = document.getElementById('loader-bar');
  let progress = 0;

  function animateLoader() {
    if (progress < 100) {
      progress += Math.random() * 25;
      if (bar) bar.style.width = Math.min(progress, 100) + '%';
      setTimeout(animateLoader, 150);
    } else {
      setTimeout(() => {
        if (loader) {
          loader.style.opacity = '0';
          setTimeout(() => loader.style.display = 'none', 700);
        }
      }, 300);
    }
  }
  animateLoader();

  // =========================================
  // 2. HOMEPAGE LOGIK (Nur Index.html)
  // =========================================

  // --- Mobile Menu (Nur wenn Button existiert) ---
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
  let isMenuOpen = false;

  function toggleMenu(forceClose = false) {
    if (!menuBtn || !mobileMenu) return;

    isMenuOpen = forceClose ? false : !isMenuOpen;

    if (isMenuOpen) {
      mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
      mobileMenu.classList.add('opacity-100');
      menuBtn.setAttribute('aria-expanded', 'true');
    } else {
      mobileMenu.classList.add('opacity-0', 'pointer-events-none');
      mobileMenu.classList.remove('opacity-100');
      menuBtn.setAttribute('aria-expanded', 'false');
    }

    // Hamburger Animation
    const bar1 = document.getElementById('bar1');
    const bar2 = document.getElementById('bar2');
    const bar3 = document.getElementById('bar3');
    if (bar1 && bar2 && bar3) {
      if (isMenuOpen) {
        bar1.classList.add('rotate-45', 'translate-y-2');
        bar2.classList.add('opacity-0');
        bar3.classList.add('-rotate-45', '-translate-y-2');
      } else {
        bar1.classList.remove('rotate-45', 'translate-y-2');
        bar2.classList.remove('opacity-0');
        bar3.classList.remove('-rotate-45', '-translate-y-2');
      }
    }
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', () => toggleMenu());
    mobileLinks.forEach(link => link.addEventListener('click', () => toggleMenu(true)));
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) toggleMenu(true);
    });
  }

  // --- Tabs (Lebenslauf) ---
  const tabExp = document.getElementById('tab-exp');
  const tabCert = document.getElementById('tab-cert');
  const expPanel = document.getElementById('exp-panel');
  const certPanel = document.getElementById('cert-panel');

  if (tabExp && tabCert && expPanel && certPanel) {
    const pillContainer = tabExp.closest('.cv-pill-custom');
    const switchTab = (isExp) => {
      // Toggle container wrapper class
      if (pillContainer) {
        pillContainer.classList.toggle('cv-pill-exp', isExp);
        pillContainer.classList.toggle('cv-pill-cert', !isExp);
      }

      // Accessibility attributes
      tabExp.setAttribute('aria-selected', isExp ? 'true' : 'false');
      tabCert.setAttribute('aria-selected', isExp ? 'false' : 'true');

      // Panels
      isExp ? expPanel.classList.remove('hidden') : expPanel.classList.add('hidden');
      isExp ? certPanel.classList.add('hidden') : certPanel.classList.remove('hidden');
    };

    tabExp.addEventListener('click', () => switchTab(true));
    tabCert.addEventListener('click', () => switchTab(false));
  }

  // --- CV Accordions (Always active on desktop & mobile) ---
  const cvItems = document.querySelectorAll('.cv-item');
  if (cvItems.length > 0) {
    cvItems.forEach(item => {
      item.addEventListener('click', (e) => {
        // If clicking a link inside, proceed normally
        if (e.target.closest('a')) {
          return;
        }

        const accordion = item.querySelector('.cv-accordion');
        if (!accordion) return;

        const isExpanded = accordion.classList.contains('is-expanded');
        
        // Get the parent container to only close items in the same tab/list panel
        const parentContainer = item.closest('.cv-list-container');
        if (parentContainer) {
          const otherItems = parentContainer.querySelectorAll('.cv-item');
          otherItems.forEach(otherItem => {
            if (otherItem !== item) {
              const otherAccordion = otherItem.querySelector('.cv-accordion');
              if (otherAccordion && otherAccordion.classList.contains('is-expanded')) {
                otherAccordion.style.maxHeight = '0';
                otherAccordion.classList.remove('is-expanded');
                otherItem.setAttribute('aria-expanded', 'false');
              }
            }
          });
        }

        // Toggle current accordion
        if (isExpanded) {
          accordion.style.maxHeight = '0';
          accordion.classList.remove('is-expanded');
          item.setAttribute('aria-expanded', 'false');
        } else {
          accordion.classList.add('is-expanded');
          accordion.style.maxHeight = accordion.scrollHeight + 'px';
          item.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // Resize handler to adjust max-height of active accordions dynamically
    window.addEventListener('resize', () => {
      document.querySelectorAll('.cv-item[aria-expanded="true"]').forEach(item => {
        const accordion = item.querySelector('.cv-accordion');
        if (accordion && accordion.classList.contains('is-expanded')) {
          accordion.style.maxHeight = accordion.scrollHeight + 'px';
        }
      });
    });
  }


  // --- Fade In Observer (Home & Project Pages) ---
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fadein-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.project-fadein').forEach(el => observer.observe(el));

  // --- DYNAMIC PROJECT HOVER REVEAL & MOBILE ACCORDION LOGIK ---
  const projectItems = document.querySelectorAll('.project-item');
  const hoverImageContainer = document.getElementById('project-hover-image');
  const hoverImg = hoverImageContainer ? hoverImageContainer.querySelector('img') : null;

  // Mouse Cursor Follow (Lerp Physics)
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  const lerpFactor = 0.12; 
  let hideTimeout = null;

  function updateHoverPosition() {
    if (hoverImageContainer && !hoverImageContainer.classList.contains('hidden')) {
      currentX += (targetX - currentX) * lerpFactor;
      currentY += (targetY - currentY) * lerpFactor;

      // Apply offset so image floats top-right of cursor (height is ~213px + 15px gap = 228px offset)
      hoverImageContainer.style.transform = `translate3d(${currentX + 15}px, ${currentY - 228}px, 0)`;
    }

    requestAnimationFrame(updateHoverPosition);
  }

  if (projectItems.length > 0 && hoverImageContainer && hoverImg) {
    let firstMove = true;

    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (firstMove) {
        currentX = targetX;
        currentY = targetY;
        firstMove = false;
      }
    });

    // Start continuous loop
    requestAnimationFrame(updateHoverPosition);

    projectItems.forEach(item => {
      // Desktop Hover Behavior
      item.addEventListener('mouseenter', () => {
        if (window.innerWidth >= 768) {
          if (hideTimeout) clearTimeout(hideTimeout);
          
          const imgSrc = item.getAttribute('data-image');
          if (imgSrc) {
            hoverImg.src = imgSrc;
            hoverImageContainer.classList.remove('hidden');
            // Force layout reflow before adding opacity class
            void hoverImageContainer.offsetWidth;
            hoverImageContainer.classList.add('is-visible');
          } else {
            hoverImageContainer.classList.remove('is-visible');
            hoverImageContainer.classList.add('hidden');
          }
        }
      });

      item.addEventListener('mouseleave', () => {
        if (window.innerWidth >= 768) {
          hoverImageContainer.classList.remove('is-visible');
          if (hideTimeout) clearTimeout(hideTimeout);
          hideTimeout = setTimeout(() => {
            hoverImageContainer.classList.add('hidden');
          }, 350); 
        }
      });

      // Click Navigation (Desktop) & Accordion Toggle (Mobile)
      item.addEventListener('click', (e) => {
        const url = item.getAttribute('data-url');
        
        // On desktop: direct navigate
        if (window.innerWidth >= 768) {
          if (url) window.location.href = url;
          return;
        }

        // On mobile: accordion expand/collapse
        // If clicking on direct links inside expanded area, proceed with navigation
        if (e.target.closest('a') || e.target.closest('.mobile-accordion a')) {
          return;
        }

        e.preventDefault();
        e.stopPropagation();

        const accordion = item.querySelector('.mobile-accordion');
        const arrow = item.querySelector('.flex svg');
        if (!accordion) return;

        const isExpanded = accordion.classList.contains('is-expanded');

        // Collapse all other accordions first
        projectItems.forEach(otherItem => {
          if (otherItem !== item) {
            const otherAccordion = otherItem.querySelector('.mobile-accordion');
            const otherArrow = otherItem.querySelector('.flex svg');
            if (otherAccordion && otherAccordion.classList.contains('is-expanded')) {
              otherAccordion.style.maxHeight = '0';
              otherAccordion.classList.remove('is-expanded');
              if (otherArrow) otherArrow.classList.remove('rotate-90');
              otherItem.setAttribute('aria-expanded', 'false');
            }
          }
        });

        // Toggle current accordion
        if (isExpanded) {
          accordion.style.maxHeight = '0';
          accordion.classList.remove('is-expanded');
          if (arrow) arrow.classList.remove('rotate-90');
          item.setAttribute('aria-expanded', 'false');
        } else {
          accordion.classList.add('is-expanded');
          accordion.style.maxHeight = accordion.scrollHeight + 'px';
          if (arrow) arrow.classList.add('rotate-90');
          item.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // Close accordion if resizing above mobile breakpoint
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) {
        projectItems.forEach(item => {
          const accordion = item.querySelector('.mobile-accordion');
          const arrow = item.querySelector('.flex svg');
          if (accordion && accordion.classList.contains('is-expanded')) {
            accordion.style.maxHeight = '0';
            accordion.classList.remove('is-expanded');
            if (arrow) arrow.classList.remove('rotate-90');
            item.setAttribute('aria-expanded', 'false');
          }
        });
        if (hoverImageContainer) {
          hoverImageContainer.classList.remove('is-visible');
          hoverImageContainer.classList.add('hidden');
        }
      }
    });
  }


  // =========================================
  // 3. PROJEKT-SEITEN LOGIK (Galerie & Modal)
  // =========================================

  const galleryContainer = document.querySelector('.gallery-container-wrapper');

  if (galleryContainer) {
    // --- Galerie Setup ---
    const galleryImage = document.querySelector('.gallery-main-image');
    const galleryPrevBtn = document.querySelector('.gallery-prev-btn');
    const galleryNextBtn = document.querySelector('.gallery-next-btn');
    const galleryCounter = document.querySelector('.gallery-counter');

    let pageGalleryImages = [];
    let currentPageGalleryIndex = 0;

    // Daten sammeln
    document.querySelectorAll('[data-gallery-index]').forEach(item => {
      const idx = parseInt(item.getAttribute('data-gallery-index'));
      const src = item.getAttribute('data-gallery-src');
      // Fix: Manchmal ist das Data-Attribut im hidden div, manchmal im figure
      if (src) {
        pageGalleryImages[idx] = {
          src: src,
          alt: item.getAttribute('data-gallery-alt') || ''
        };
      }
    });

    const updatePageGallery = (index) => {
      if (index >= 0 && index < pageGalleryImages.length && galleryImage) {
        currentPageGalleryIndex = index;

        // Update das <picture> Element, falls vorhanden
        const picture = galleryImage.closest('picture');
        if (picture) {
          const source = picture.querySelector('source');
          if (source) {
            source.srcset = pageGalleryImages[index].src;
          }
        }

        // Force image reload by setting src to empty first, then to new source
        galleryImage.src = '';
        // Use requestAnimationFrame to ensure the browser processes the empty src
        requestAnimationFrame(() => {
          galleryImage.src = pageGalleryImages[index].src;
          galleryImage.alt = pageGalleryImages[index].alt;
        });

        if (galleryCounter) galleryCounter.textContent = `${index + 1} / ${pageGalleryImages.length}`;
      }
    };

    if (galleryPrevBtn) {
      galleryPrevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const newIndex = currentPageGalleryIndex > 0 ? currentPageGalleryIndex - 1 : pageGalleryImages.length - 1;
        updatePageGallery(newIndex);
      });
    }

    if (galleryNextBtn) {
      galleryNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const newIndex = currentPageGalleryIndex < pageGalleryImages.length - 1 ? currentPageGalleryIndex + 1 : 0;
        updatePageGallery(newIndex);
      });
    }

    // --- Modal Setup ---
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeModalBtn = document.getElementById('closeModal');
    const modalPrevBtn = document.getElementById('prevImage');
    const modalNextBtn = document.getElementById('nextImage');
    const modalCounter = document.getElementById('imageCounter');

    let isModalGalleryMode = false;
    let currentModalIndex = -1;

    const openModal = (src, alt, galleryMode = false, index = -1) => {
      if (!imageModal || !modalImage) return;

      isModalGalleryMode = galleryMode;
      currentModalIndex = index;

      modalImage.src = src;
      modalImage.alt = alt;

      // Buttons zeigen/verstecken
      const displayStyle = galleryMode ? 'flex' : 'none';
      if (modalPrevBtn) modalPrevBtn.style.display = displayStyle;
      if (modalNextBtn) modalNextBtn.style.display = displayStyle;
      if (modalCounter) {
        modalCounter.style.display = galleryMode ? 'block' : 'none';
        if (galleryMode) modalCounter.textContent = `${index + 1} / ${pageGalleryImages.length}`;
      }

      imageModal.classList.remove('hidden');
      imageModal.classList.add('flex');
      document.body.style.overflow = 'hidden'; // Scroll lock
    };

    const closeModal = () => {
      if (!imageModal) return;
      imageModal.classList.add('hidden');
      imageModal.classList.remove('flex');
      document.body.style.overflow = '';
      isModalGalleryMode = false;
    };

    // Klick auf normales Bild (nicht Galerie)
    document.querySelectorAll('figure img').forEach(img => {
      if (!img.closest('.gallery-item') && !img.closest('.hidden')) {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => openModal(img.src, img.alt, false));
      }
    });

    // Klick auf Galerie Bild
    if (galleryImage) {
      galleryImage.addEventListener('click', () => {
        openModal(
          pageGalleryImages[currentPageGalleryIndex].src,
          pageGalleryImages[currentPageGalleryIndex].alt,
          true,
          currentPageGalleryIndex
        );
      });
    }

    // Modal Navigation
    const navigateModal = (direction) => {
      if (!isModalGalleryMode) return;

      let newIndex = direction === 'next'
        ? (currentModalIndex < pageGalleryImages.length - 1 ? currentModalIndex + 1 : 0)
        : (currentModalIndex > 0 ? currentModalIndex - 1 : pageGalleryImages.length - 1);

      currentModalIndex = newIndex;
      modalImage.src = pageGalleryImages[newIndex].src;
      modalImage.alt = pageGalleryImages[newIndex].alt;
      if (modalCounter) modalCounter.textContent = `${newIndex + 1} / ${pageGalleryImages.length}`;
    };

    if (modalNextBtn) modalNextBtn.addEventListener('click', (e) => { e.stopPropagation(); navigateModal('next'); });
    if (modalPrevBtn) modalPrevBtn.addEventListener('click', (e) => { e.stopPropagation(); navigateModal('prev'); });
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (imageModal) imageModal.addEventListener('click', (e) => { if (e.target === imageModal) closeModal(); });

    // Keyboard Events (Galerie & Modal)
    document.addEventListener('keydown', (e) => {
      if (imageModal && !imageModal.classList.contains('hidden')) {
        // Modal offen
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowRight') navigateModal('next');
        if (e.key === 'ArrowLeft') navigateModal('prev');
      } else {
        // Modal zu -> Galerie auf Seite steuern
        if (e.key === 'ArrowRight' && galleryNextBtn) {
          const newIndex = currentPageGalleryIndex < pageGalleryImages.length - 1 ? currentPageGalleryIndex + 1 : 0;
          updatePageGallery(newIndex);
        }
        if (e.key === 'ArrowLeft' && galleryPrevBtn) {
          const newIndex = currentPageGalleryIndex > 0 ? currentPageGalleryIndex - 1 : pageGalleryImages.length - 1;
          updatePageGallery(newIndex);
        }
      }
    });
  }
});