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

      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.click();
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
  // 3. PROJEKT-SEITEN LOGIK (Modal für Einzelbilder)
  // =========================================

  const imageModal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const closeModalBtn = document.getElementById('closeModal');

  if (imageModal && modalImage) {
    let focusedElementBeforeModal = null;

    const openModal = (src, alt) => {
      focusedElementBeforeModal = document.activeElement;
      modalImage.src = src;
      modalImage.alt = alt;
      imageModal.classList.remove('hidden');
      imageModal.classList.add('flex');
      document.body.style.overflow = 'hidden'; // Scroll lock
      if (closeModalBtn) {
        closeModalBtn.focus();
      }
    };

    const closeModal = () => {
      imageModal.classList.add('hidden');
      imageModal.classList.remove('flex');
      document.body.style.overflow = '';
      if (focusedElementBeforeModal) {
        focusedElementBeforeModal.focus();
      }
    };

    // Klick auf normales Bild (alle Bilder in figure Elementen)
    document.querySelectorAll('figure img').forEach(img => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => openModal(img.src, img.alt));
    });

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    imageModal.addEventListener('click', (e) => { if (e.target === imageModal) closeModal(); });

    // Focus Trap & Keyboard Navigation for close
    imageModal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
      if (e.key === 'Tab') {
        // Tab key focus trap
        const allFocusable = Array.from(imageModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
          .filter(el => el.style.display !== 'none' && !el.disabled);

        if (allFocusable.length === 0) {
          e.preventDefault();
          return;
        }

        const firstEl = allFocusable[0];
        const lastEl = allFocusable[allFocusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            lastEl.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastEl) {
            firstEl.focus();
            e.preventDefault();
          }
        }
      }
    });
  }

  // =========================================
  // 4. CONTACT SECTION (Copy Email)
  // =========================================
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyEmailText = document.getElementById('copy-email-text');
  const copyEmailIcon = document.getElementById('copy-email-icon');
  const copyEmailSuccess = document.getElementById('copy-email-success');

  if (copyEmailBtn && copyEmailText && copyEmailIcon && copyEmailSuccess) {
    const originalText = copyEmailText.textContent;
    const emailToCopy = copyEmailBtn.getAttribute('data-email');

    // Set transitions
    copyEmailText.style.transition = 'opacity 0.15s ease';
    copyEmailIcon.style.transition = 'opacity 0.15s ease';
    copyEmailSuccess.style.transition = 'opacity 0.15s ease';

    copyEmailBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(emailToCopy);
        
        // Fade out
        copyEmailText.style.opacity = '0';
        copyEmailIcon.style.opacity = '0';
        copyEmailSuccess.style.opacity = '0';

        setTimeout(() => {
          // Show success state
          const isEnglish = document.documentElement.lang === 'en';
          copyEmailText.textContent = isEnglish ? 'Copied!' : 'Kopiert!';
          copyEmailIcon.classList.add('hidden');
          copyEmailSuccess.classList.remove('hidden');
          
          // Fade in
          copyEmailText.style.opacity = '1';
          copyEmailSuccess.style.opacity = '1';
        }, 150);

        // Revert after 2 seconds
        setTimeout(() => {
          // Fade out success state
          copyEmailText.style.opacity = '0';
          copyEmailSuccess.style.opacity = '0';

          setTimeout(() => {
            copyEmailText.textContent = originalText;
            copyEmailIcon.classList.remove('hidden');
            copyEmailSuccess.classList.add('hidden');
            
            // Fade in original state
            copyEmailText.style.opacity = '1';
            copyEmailIcon.style.opacity = '1';
          }, 150);
        }, 2000);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    });
  }

  // --- Awwward-winning Button Hover Glow Spotlight (Airbnb style) ---
  document.addEventListener('mousemove', (e) => {
    const target = e.target.closest('.super-btn');
    if (target) {
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      target.style.setProperty('--x', `${x}px`);
      target.style.setProperty('--y', `${y}px`);
    }
  });
});