(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const opening = $('#opening');
  const invitation = $('#invitation');
  const giftScene = $('#giftScene');
  const openButton = $('#openInvite');
  const skipButton = $('#skipOpening');
  const music = $('#backgroundMusic');
  const musicToggle = $('#musicToggle');
  let opened = false;
  let sealTimer = null;
  let sealComplete = false;

  function revealInvitation() {
    if (opened) return;
    opened = true;
    opening.classList.add('opening-away');
    giftScene.classList.add('gift-open');
    openButton.disabled = true;
    window.setTimeout(() => {
      opening.hidden = true;
      invitation.classList.remove('is-hidden');
      document.body.classList.add('invitation-live');
      window.setTimeout(() => $('.hero')?.classList.add('curtains-open'), 180);
      observeSections();
    }, 1150);
  }
  openButton?.addEventListener('click', revealInvitation);
  skipButton?.addEventListener('click', revealInvitation);

  // Background music is opt-in; browsers do not allow reliable autoplay.
  musicToggle?.addEventListener('click', async () => {
    if (!music) return;
    if (music.paused) {
      try {
        await music.play();
        musicToggle.classList.add('is-playing');
        musicToggle.setAttribute('aria-pressed', 'true');
        musicToggle.setAttribute('aria-label', 'Pause background music');
        $('.music-label').textContent = 'SOUND ON';
      } catch (_) {
        $('.music-label').textContent = 'TAP TO PLAY';
      }
    } else {
      music.pause();
      musicToggle.classList.remove('is-playing');
      musicToggle.setAttribute('aria-pressed', 'false');
      musicToggle.setAttribute('aria-label', 'Play background music');
      $('.music-label').textContent = 'SOUND OFF';
    }
  });

  // Letter flip uses a real button and remains keyboard accessible.
  const letterCard = $('#letterCard');
  letterCard?.addEventListener('click', () => {
    const isOpen = letterCard.classList.toggle('letter-open');
    letterCard.setAttribute('aria-expanded', String(isOpen));
    letterCard.setAttribute('aria-label', isOpen ? 'Close the invitation letter' : 'Open the invitation letter');
  });

  // Press-and-hold wax seal. Pointer cancellation prevents accidental reveal on scroll.
  const seal = $('#waxSeal');
  const dateReveal = $('#dateReveal');
  const sealHint = $('#sealHint');
  function startSeal(event) {
    if (sealComplete) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    seal.classList.add('sealing');
    sealHint.textContent = 'KEEP HOLDING…';
    sealTimer = window.setTimeout(() => {
      sealComplete = true;
      seal.classList.remove('sealing');
      seal.classList.add('sealed-open');
      dateReveal.classList.add('date-visible');
      sealHint.textContent = 'THE DATE IS REVEALED';
      if (navigator.vibrate) navigator.vibrate(35);
    }, 850);
  }
  function cancelSeal() {
    if (sealComplete) return;
    window.clearTimeout(sealTimer);
    seal?.classList.remove('sealing');
    if (sealHint) sealHint.textContent = 'PRESS & HOLD THE SEAL';
  }
  seal?.addEventListener('pointerdown', startSeal);
  seal?.addEventListener('pointerup', cancelSeal);
  seal?.addEventListener('pointerleave', cancelSeal);
  seal?.addEventListener('pointercancel', cancelSeal);
  seal?.addEventListener('contextmenu', (event) => event.preventDefault());

  // Download a local .ics calendar invitation without a third-party service.
  $('#calendarButton')?.addEventListener('click', () => {
    const ics = [
      'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Anas and Rabiya//Valima Invitation//EN',
      'CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:anas-rabiya-valima-20270117@invitation',
      'DTSTAMP:20261123T000000Z','DTSTART;TZID=Asia/Karachi:20270117T200000',
      'SUMMARY:Anas & Rabiya — Valima Reception',
      'LOCATION:The Liberty Ballroom, Karachi, Pakistan',
      'DESCRIPTION:You are warmly invited to celebrate the Valima of Anas & Rabiya.',
      'END:VEVENT','END:VCALENDAR'
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = 'Anas-and-Rabiya-Valima.ics';
    document.body.appendChild(link); link.click(); link.remove();
    URL.revokeObjectURL(url);
  });

  // Reply opens the phone's share sheet with a ready-to-send RSVP message.
  const invitationText = 'Assalam-o-Alaikum! I received the Valima invitation of Anas & Rabiya on Sunday, 17 January 2027 at 8:00 PM, The Liberty Ballroom, Karachi. I would like to reply: ';
  async function shareInvitation(text) {
    if (navigator.share) {
      try { await navigator.share({ title: 'Anas & Rabiya — Valima', text, url: window.location.href }); return; }
      catch (error) { if (error && error.name === 'AbortError') return; }
    }
    try {
      await navigator.clipboard.writeText(text + window.location.href);
      alert('Invitation message copied. You can paste it into WhatsApp.');
    } catch (_) {
      window.open('https://wa.me/?text=' + encodeURIComponent(text + window.location.href), '_blank', 'noopener');
    }
  }
  $('#replyButton')?.addEventListener('click', () => shareInvitation(invitationText));
  $('#shareButton')?.addEventListener('click', () => shareInvitation('Please join us to celebrate the Valima of Anas & Rabiya on 17 January 2027 at 8:00 PM in Karachi.'));

  // Countdown is tied to the event's Karachi local time (UTC+5).
  const eventTime = new Date('2027-01-17T20:00:00+05:00').getTime();
  const pad = (value) => String(value).padStart(2, '0');
  function updateCountdown() {
    const distance = eventTime - Date.now();
    if (distance <= 0) {
      $('#countdown').innerHTML = '<p class="countdown-ended">TODAY IS THE DAY — WE LOOK FORWARD TO SEEING YOU</p>';
      return;
    }
    const days = Math.floor(distance / 86400000);
    const hours = Math.floor((distance % 86400000) / 3600000);
    const minutes = Math.floor((distance % 3600000) / 60000);
    const seconds = Math.floor((distance % 60000) / 1000);
    $('#days').textContent = days;
    $('#hours').textContent = pad(hours);
    $('#minutes').textContent = pad(minutes);
    $('#seconds').textContent = pad(seconds);
  }
  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  // Reveal sections as they enter the viewport; no dependency on animation libraries.
  function observeSections() {
    const targets = document.querySelectorAll('.section-shell, .venue-visual, .venue-details, .event-card, .eyebrow, .section-heading');
    if (!('IntersectionObserver' in window)) {
      targets.forEach((item) => item.classList.add('in-view'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    targets.forEach((item) => observer.observe(item));
  }
})();
