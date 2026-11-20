document.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('intro');
  const invitation = document.getElementById('invitation');
  const openButton = document.getElementById('openInvite');
  const letterCard = document.getElementById('letterCard');
  let invitationOpened = false;

  // Open the invitation while preserving the original reveal sequence.
  if (openButton && intro && invitation) {
    openButton.addEventListener('click', () => {
      if (invitationOpened) return;
      invitationOpened = true;
      intro.classList.add('intro-leaving');
      intro.style.transition = 'opacity 1s ease, transform 1s ease';
      intro.style.opacity = '0';
      intro.style.transform = 'scale(1.035)';
      window.setTimeout(() => {
        intro.style.display = 'none';
        invitation.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        invitation.querySelectorAll('.reveal').forEach((el, i) => {
          window.setTimeout(() => el.classList.add('visible'), i * 180);
        });
      }, 850);
    });
  }

  // Scroll reveals.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  // Interactive letter: tap to unfold / fold.
  if (letterCard) {
    letterCard.addEventListener('click', () => {
      const isOpen = letterCard.classList.toggle('is-open');
      letterCard.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Karachi local event time: 17 January 2027, 8:00 PM (UTC+05:00).
  const eventDate = new Date('2027-01-17T20:00:00+05:00').getTime();
  function updateCountdown() {
    const distance = Math.max(0, eventDate - Date.now());
    const values = {
      days: Math.floor(distance / 86400000),
      hours: Math.floor((distance % 86400000) / 3600000),
      minutes: Math.floor((distance % 3600000) / 60000),
      seconds: Math.floor((distance % 60000) / 1000)
    };
    Object.entries(values).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = String(value).padStart(2, '0');
    });
  }
  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  // Background music: mobile browsers require a direct user tap.
  const audio = document.getElementById('backgroundMusic');
  const musicToggle = document.getElementById('musicToggle');
  const musicLabel = document.getElementById('musicLabel');
  if (audio && musicToggle) {
    musicToggle.addEventListener('click', async () => {
      if (audio.paused) {
        try {
          await audio.play();
          musicToggle.classList.add('playing');
          musicToggle.setAttribute('aria-label', 'Pause background music');
          if (musicLabel) musicLabel.textContent = 'MUSIC ON';
        } catch (error) {
          if (musicLabel) musicLabel.textContent = 'AUDIO UNAVAILABLE';
          console.warn('Background music could not play:', error);
        }
      } else {
        audio.pause();
        musicToggle.classList.remove('playing');
        musicToggle.setAttribute('aria-label', 'Play background music');
        if (musicLabel) musicLabel.textContent = 'MUSIC OFF';
      }
    });
    audio.addEventListener('ended', () => {
      musicToggle.classList.remove('playing');
      if (musicLabel) musicLabel.textContent = 'MUSIC OFF';
    });
  }

  // Share invitation.
  const shareButton = document.getElementById('shareButton');
  if (shareButton) {
    shareButton.addEventListener('click', async () => {
      const data = {
        title: 'Anas & Rabiya | Valima Invitation',
        text: 'You are invited to the Valima of Anas & Rabiya on 17 January 2027 at 8:00 PM, The Liberty Ballroom, Karachi.',
        url: location.href
      };
      if (navigator.share) {
        try { await navigator.share(data); } catch (error) { /* user cancelled */ }
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(location.href);
          shareButton.querySelector('span').textContent = 'COPIED';
          window.setTimeout(() => shareButton.querySelector('span').textContent = '↗', 1800);
        } catch (error) {
          window.prompt('Copy this invitation link:', location.href);
        }
      } else {
        window.prompt('Copy this invitation link:', location.href);
      }
    });
  }
});
