(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const opening = $('opening');
  const invitation = $('invitation');
  const openButton = $('openInvite');
  let hasOpened = false;

  openButton?.addEventListener('click', () => {
    if (hasOpened || !opening || !invitation) return;
    hasOpened = true;
    openButton.disabled = true;
    opening.classList.add('is-opening');
    // Allow the flap to open and the card to rise before the cinematic page reveal.
    window.setTimeout(() => {
      opening.hidden = true;
      opening.style.display = 'none';
      invitation.classList.remove('is-hidden');
      window.scrollTo({ top: 0, behavior: 'instant' });
      observeReveals();
    }, 1450);
  });

  let revealObserver;
  function observeReveals() {
    const items = document.querySelectorAll('.reveal:not(.visible)');
    if (!('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('visible'));
      return;
    }
    revealObserver ||= new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    items.forEach((item) => revealObserver.observe(item));
  }

  // Date and time are Karachi local time (UTC+05:00).
  const eventTime = new Date('2027-01-17T20:00:00+05:00').getTime();
  function updateCountdown() {
    const remaining = Math.max(0, eventTime - Date.now());
    const values = {
      days: Math.floor(remaining / 86400000),
      hours: Math.floor((remaining % 86400000) / 3600000),
      minutes: Math.floor((remaining % 3600000) / 60000),
      seconds: Math.floor((remaining % 60000) / 1000)
    };
    Object.entries(values).forEach(([id, value]) => {
      const node = $(id);
      if (node) node.textContent = String(value).padStart(2, '0');
    });
  }
  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  const audio = $('backgroundMusic');
  const musicButton = $('musicToggle');
  const musicLabel = $('musicLabel');
  musicButton?.addEventListener('click', async () => {
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
        musicButton.classList.add('playing');
        musicButton.setAttribute('aria-label', 'Pause background music');
        if (musicLabel) musicLabel.textContent = 'SOUND ON';
      } catch (_) {
        if (musicLabel) musicLabel.textContent = 'AUDIO UNAVAILABLE';
      }
    } else {
      audio.pause();
      musicButton.classList.remove('playing');
      musicButton.setAttribute('aria-label', 'Play background music');
      if (musicLabel) musicLabel.textContent = 'SOUND OFF';
    }
  });

  const shareButton = $('shareButton');
  shareButton?.addEventListener('click', async () => {
    const shareData = {
      title: 'Anas & Rabiya — Valima Invitation',
      text: 'You are invited to the Valima of Anas & Rabiya on 17 January 2027 at 8:00 PM, The Liberty Ballroom, Karachi.',
      url: window.location.href
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (_) { /* User cancelled sharing. */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      const label = shareButton.querySelector('span');
      if (label) {
        label.textContent = 'COPIED';
        window.setTimeout(() => { label.textContent = '↗'; }, 1800);
      }
    } catch (_) {
      window.prompt('Copy this invitation link:', window.location.href);
    }
  });

  // Keyboard users can activate the opening button; reveal observers start after opening.
})();
