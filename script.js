
document.addEventListener('DOMContentLoaded', () => {

  const intro = document.getElementById('intro');
  const invitation = document.getElementById('invitation');
  const openButton = document.getElementById('openInvite');

  // Open invitation
  if (openButton) {
    openButton.addEventListener('click', () => {
      intro.style.transition = 'opacity 1s ease, transform 1s ease';
      intro.style.opacity = '0';
      intro.style.transform = 'scale(1.04)';

      setTimeout(() => {
        intro.style.display = 'none';
        invitation.classList.remove('hidden');

        document.querySelectorAll('.reveal').forEach((el, i) => {
          setTimeout(() => el.classList.add('visible'), i * 250);
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1000);
    });
  }

  // Animate sections on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Countdown
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
  setInterval(updateCountdown, 1000);

  // Background music
  const audio = document.getElementById('backgroundMusic');
  const musicToggle = document.getElementById('musicToggle');
  const musicLabel = document.getElementById('musicLabel');

  if (audio && musicToggle) {
    musicToggle.addEventListener('click', async () => {
      if (audio.paused) {
        try {
          await audio.play();
          if (musicLabel) musicLabel.textContent = 'MUSIC ON';
        } catch(e){alert('Music Error: '+e.name+' - '+e.message);musicLabel.textContent='MUSIC ERROR';}
      } else {
        audio.pause();
        if (musicLabel) musicLabel.textContent = 'MUSIC OFF';
      }
    });
  }

  // Share invitation
  const shareButton = document.getElementById('shareButton');

  if (shareButton) {
    shareButton.addEventListener('click', async () => {
      const data = {
        title: 'Anas & Rabiya | Valima Invitation',
        text: 'You are invited to the Valima of Anas & Rabiya on 17 January 2027 at 8:00 PM, The Liberty Ballroom, Karachi.',
        url: location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(data);
        } catch (error) {}
      } else {
        prompt('Copy this invitation link:', location.href);
      }
    });
  }

});
