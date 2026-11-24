document.addEventListener("DOMContentLoaded", () => {
  const giftScreen = document.getElementById("giftScreen");
  const giftWrap = document.getElementById("giftWrap");
  const openButton = document.getElementById("openInvite");
  const invitation = document.getElementById("invitation");
  const curtainHero = document.getElementById("curtainHero");
  const scrollCue = document.getElementById("scrollCue");
  let opening = false;
  
  // Keep the invitation in the document and reveal it only after the box animation.
  openButton?.addEventListener("click", () => {
    if (opening) return;
    opening = true;
    giftScreen.classList.add("is-opening");
    openButton.disabled = true;

    window.setTimeout(() => {
      giftScreen.hidden = true;
      invitation.classList.add("is-visible");
      invitation.setAttribute("aria-hidden", "false");
      window.scrollTo({ top: 0, behavior: "instant" });

      // The curtains part after the invitation section is visible; no blank/black frame.
observeCurtain();
observeReveals();;}, 2200);});
  scrollCue?.addEventListener("click", () => {
    document.querySelector(".letter-section")?.scrollIntoView({ behavior: "smooth" });});
  function observeCurtain() {
  if (!curtainHero || !("IntersectionObserver" in window)) {
    curtainHero?.classList.add("curtains-open");
    return;}
  const curtainObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
        curtainHero.classList.add("curtains-open");} else {
        curtainHero.classList.remove("curtains-open");}});}, {
    threshold: [0, 0.45, 0.6]});
  curtainObserver.observe(curtainHero);}
  
  function observeReveals() {
    const sections = document.querySelectorAll("#invitation .reveal");
    if (!("IntersectionObserver" in window)) {
      sections.forEach(section => section.classList.add("visible"));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    sections.forEach(section => observer.observe(section));
  }

  // Letter card works with touch, mouse and keyboard.
  const letterCard = document.getElementById("letterCard");
  function toggleLetter() {
    const isOpen = letterCard.classList.toggle("is-open");
    letterCard.setAttribute("aria-expanded", String(isOpen));
  }
  letterCard?.addEventListener("click", toggleLetter);
  letterCard?.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleLetter();
    }
  });

  // Press-and-hold wax seal. Pointer capture prevents a missed release on touch screens.
  const waxSeal = document.getElementById("waxSeal");
  const dateReveal = document.getElementById("dateReveal");
  const sealCaption = document.getElementById("sealCaption");
  let holdTimer = null;
  let sealOpened = false;
  function startSeal(event) {
    if (sealOpened) return;
    event.preventDefault();
    waxSeal.classList.add("holding");
    sealCaption.textContent = "Keep holding…";
    try { waxSeal.setPointerCapture(event.pointerId); } catch (_) {}
    holdTimer = window.setTimeout(() => {
      sealOpened = true;
      waxSeal.classList.remove("holding");
      waxSeal.classList.add("opened");
      dateReveal.classList.add("revealed");
      sealCaption.textContent = "Sealed with love";
    }, 1100);
  }
  function cancelSeal() {
    if (holdTimer) window.clearTimeout(holdTimer);
    holdTimer = null;
    waxSeal?.classList.remove("holding");
    if (!sealOpened && sealCaption) sealCaption.textContent = "Press and hold the seal";
  }
  waxSeal?.addEventListener("pointerdown", startSeal);
  waxSeal?.addEventListener("pointerup", cancelSeal);
  waxSeal?.addEventListener("pointercancel", cancelSeal);
  waxSeal?.addEventListener("lostpointercapture", cancelSeal);
  waxSeal?.addEventListener("keydown", event => {
    if ((event.key === "Enter" || event.key === " ") && !sealOpened) {
      event.preventDefault();
      sealOpened = true;
      dateReveal.classList.add("revealed");
      sealCaption.textContent = "Sealed with love";
    }
  });

  // Event time: 17 January 2027, 8:00 PM in Karachi (UTC+05:00).
  const eventTime = new Date("2027-01-17T20:00:00+05:00").getTime();
  function updateCountdown() {
    const remaining = Math.max(0, eventTime - Date.now());
    const units = {
      days: Math.floor(remaining / 86400000),
      hours: Math.floor((remaining % 86400000) / 3600000),
      minutes: Math.floor((remaining % 3600000) / 60000),
      seconds: Math.floor((remaining % 60000) / 1000)
    };
    Object.entries(units).forEach(([id, value]) => {
      const node = document.getElementById(id);
      if (node) node.textContent = String(value).padStart(2, "0");
    });
  }
  updateCountdown();
  window.setInterval(updateCountdown, 1000);
// Background music with autoplay attempt and browser fallback.
const audio = document.getElementById("backgroundMusic");
const musicToggle = document.getElementById("musicToggle");
const musicLabel = document.getElementById("musicLabel");

function updateMusicButton() {
  if (!audio || !musicLabel || !musicToggle) return;

  if (audio.paused) {
    musicLabel.textContent = "SOUND OFF";
    musicToggle.setAttribute("aria-label", "Play background music");
  } else {
    musicLabel.textContent = "SOUND ON";
    musicToggle.setAttribute("aria-label", "Pause background music");
  }
}

async function playMusic() {
  if (!audio) return;

  try {
    await audio.play();
    updateMusicButton();

    document.removeEventListener("pointerdown", startMusicOnInteraction);
    document.removeEventListener("keydown", startMusicOnInteraction);
  } catch (error) {
    updateMusicButton();
  }
}

function startMusicOnInteraction(event) {
  if (event.target.closest("#musicToggle")) return;
  playMusic();
}

// Try autoplay as soon as the website loads.
playMusic();

// If the browser blocks autoplay, start music on the visitor's first interaction.
document.addEventListener("pointerdown", startMusicOnInteraction);
document.addEventListener("keydown", startMusicOnInteraction);

// Sound ON/OFF button.
musicToggle?.addEventListener("click", async () => {
  if (!audio) return;

  if (audio.paused) {
    await playMusic();
  } else {
    audio.pause();
    updateMusicButton();
  }
});
  const shareButton = document.getElementById("shareButton");
  shareButton?.addEventListener("click", async () => {
    const shareData = {
      title: "Anas & Rabiya | Valima Invitation",
      text: "You are invited to the Valima of Anas & Rabiya on 17 January 2027 at 8:00 PM, The Liberty Ballroom, Karachi.",
      url: location.href
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (_) {}
    } else if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(location.href);
        shareButton.textContent = "LINK COPIED ✓";
        window.setTimeout(() => shareButton.textContent = "SHARE THE INVITATION ↗", 2000);
      } catch (_) {
        window.prompt("Copy your invitation link:", location.href);
      }
    } else {
      window.prompt("Copy your invitation link:", location.href);
    }
  });
});

const animatedElements = document.querySelectorAll(
  '.reveal, .fade-in, .animate-on-scroll'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    } else {
      entry.target.classList.remove('is-visible');
    }
  });
}, {
  threshold: 0.15
});

animatedElements.forEach((element) => {
  observer.observe(element);
});
