/* ==========================================================================
   CHAR FITZWATER FOR CCSD SCHOOL BOARD — SCRIPTS
   ========================================================================== */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // Sticky nav shadow on scroll
  // -------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // -------------------------------------------------------------------------
  // Mobile nav toggle
  // -------------------------------------------------------------------------
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
      navLinks.classList.toggle('is-open', !expanded);
    });

    // Close on nav link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('is-open');
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target)) {
        hamburger.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('is-open');
      }
    });
  }

  // -------------------------------------------------------------------------
  // Accordion (Q&A)
  // -------------------------------------------------------------------------
  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const panel    = btn.nextElementSibling;

      // Close all other open items
      document.querySelectorAll('.accordion-btn[aria-expanded="true"]').forEach(other => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          const otherPanel = other.nextElementSibling;
          if (otherPanel) {
            otherPanel.hidden = true;
            otherPanel.style.maxHeight = null;
          }
        }
      });

      btn.setAttribute('aria-expanded', String(!expanded));
      if (panel) {
        if (expanded) {
          panel.hidden = true;
          panel.style.maxHeight = null;
        } else {
          panel.hidden = false;
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      }
    });
  });

  // -------------------------------------------------------------------------
  // Smooth active-section nav highlighting
  // -------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

  const highlightNav = () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top < window.innerHeight * 0.4) current = sec.id;
    });
    navItems.forEach(a => {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + current);
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  // -------------------------------------------------------------------------
  // Video card click placeholder (for future video embeds)
  // -------------------------------------------------------------------------
  document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', () => {
      // When real video URLs are added, this function can open a lightbox.
      // For now it's a no-op placeholder.
    });
  });

  // -------------------------------------------------------------------------
  // Volunteer form — basic success feedback
  // -------------------------------------------------------------------------
  const volunteerForm = document.getElementById('volunteerForm');
  if (volunteerForm) {
    volunteerForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const btn = this.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      try {
        const res = await fetch(this.action, {
          method: 'POST',
          body: new FormData(this),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          btn.textContent = 'Thank you! We\'ll be in touch.';
          btn.style.background = '#00a0a2';
          this.reset();
        } else {
          throw new Error();
        }
      } catch {
        btn.textContent = 'Error — please try again or email us directly.';
        btn.style.background = '#c0392b';
        btn.disabled = false;
      }
    });
  }

  // -------------------------------------------------------------------------
  // Email sign-up — basic success feedback
  // -------------------------------------------------------------------------
  const emailForm = document.getElementById('emailSignup');
  if (emailForm) {
    emailForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const btn = this.querySelector('button[type="submit"]');
      btn.textContent = 'Signing you up…';
      btn.disabled = true;

      try {
        const res = await fetch(this.action, {
          method: 'POST',
          body: new FormData(this),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          btn.textContent = 'You\'re in!';
          btn.style.background = '#76328e';
          this.reset();
        } else {
          throw new Error();
        }
      } catch {
        btn.textContent = 'Error — please try again.';
        btn.style.background = '#c0392b';
        btn.disabled = false;
      }
    });
  }

  // -------------------------------------------------------------------------
  // Fade-in on scroll (lightweight intersection observer animation)
  // -------------------------------------------------------------------------
  if ('IntersectionObserver' in window) {
    const fadeEls = document.querySelectorAll(
      '.cred-card, .video-card, .testimonial-card, .endorsement-card, .accordion-item, .action-card'
    );

    // Apply initial state via inline style (avoids FOUC vs. CSS class approach)
    fadeEls.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity .5s ease, transform .5s ease';
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'none';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    fadeEls.forEach(el => io.observe(el));
  }

})();
