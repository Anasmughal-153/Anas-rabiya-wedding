document.addEventListener("DOMContentLoaded", () => {
  const giftScreen = document.getElementById("giftScreen");
  const openButton = document.getElementById("openInvite");
  const invitation = document.getElementById("invitation");
  const curtainHero = document.getElementById("curtainHero");
  const scrollCue = document.getElementById("scrollCue");

  let opening = false;
  let scrollAnimationFrame = null;

  // OPEN YOUR INVITATION: open the gift and reveal the curtain section below it.
  // Keep the opened gift cover visible so the SCROLL DOWN button remains available.
  openButton?.addEventListener("click", () => {
    if (opening || !giftScreen || !invitation) return;

    opening = true;
    giftScreen.classList.add("is-opening");
    openButton.disabled = true;

    window.setTimeout(() => {
      invitation.classList.add("is-visible");
      invitation.setAttribute("aria-hidden", "false");
      giftScreen.classList.add("is-unwrapped");

      observeCurtain();
      observeReveals();
    }, 2200);
  });

  // One cinematic scroll function, shared by the button and a natural finger swipe.
  function scrollToCurtain() {
    if (!curtainHero || !giftScreen?.classList.contains("is-unwrapped") || !invitation?.classList.contains("is-visible")) return;
    if (scrollAnimationFrame !== null) return;

    const startPosition = window.scrollY;
    const targetPosition = curtainHero.getBoundingClientRect().top + window.scrollY;
    const distance = targetPosition - startPosition;
    const duration = 1800;
    let startTime = null;

    function smoothScroll(currentTime) {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      window.scrollTo(0, startPosition + distance * easedProgress);
      if (progress < 1) {
        scrollAnimationFrame = requestAnimationFrame(smoothScroll);
      } else {
        scrollAnimationFrame = null;
        window.scrollTo(0, targetPosition);
      }
    }
    scrollAnimationFrame = requestAnimationFrame(smoothScroll);
  }

  // The visible prompt and an upward finger swipe use the same slow transition.
  scrollCue?.addEventListener("click", scrollToCurtain);
  let touchStartY = null;
  let touchStartX = null;
  let touchScrollStarted = false;

  giftScreen?.addEventListener("touchstart", (event) => {
    if (!giftScreen.classList.contains("is-unwrapped") || !event.touches.length) return;
    touchStartY = event.touches[0].clientY;
    touchStartX = event.touches[0].clientX;
    touchScrollStarted = false;
  }, { passive: true });

  giftScreen?.addEventListener("touchmove", (event) => {
    if (touchStartY === null || !giftScreen.classList.contains("is-unwrapped") || !event.touches.length) return;
    const deltaY = event.touches[0].clientY - touchStartY;
    const deltaX = event.touches[0].clientX - touchStartX;
    if (!touchScrollStarted && deltaY < -14 && Math.abs(deltaY) > Math.abs(deltaX) * 1.15) {
      event.preventDefault();
      touchScrollStarted = true;
      scrollToCurtain();
    } else if (touchScrollStarted) {
      event.preventDefault();
    }
  }, { passive: false });

  const resetTouchScroll = () => {
    touchStartY = null;
    touchStartX = null;
    touchScrollStarted = false;
  };
  giftScreen?.addEventListener("touchend", resetTouchScroll, { passive: true });
  giftScreen?.addEventListener("touchcancel", resetTouchScroll, { passive: true });

  // Curtain opening animation.
  let curtainObserver = null;

  function observeCurtain() {
    if (!curtainHero) return;

    if (!("IntersectionObserver" in window)) {
      curtainHero.classList.add("curtains-open");
      return;
    }

    if (curtainObserver) curtainObserver.disconnect();

    curtainObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
            curtainHero.classList.add("curtains-open");
          } else {
            curtainHero.classList.remove("curtains-open");
          }
        });
      },
      { threshold: [0, 0.45, 0.6] }
    );

    curtainObserver.observe(curtainHero);
  }

  // Reveal sections as they enter the viewport.
  let revealObserver = null;

  function observeReveals() {
    const animatedElements = document.querySelectorAll(
      "#invitation .reveal, #invitation .fade-in, #invitation .animate-on-scroll"
    );

    if (!("IntersectionObserver" in window)) {
      animatedElements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    if (revealObserver) revealObserver.disconnect();

    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    animatedElements.forEach((element) => revealObserver.observe(element));
  }

  // Letter card works with touch, mouse and keyboard.
  const letterCard = document.getElementById("letterCard");

  function toggleLetter() {
    if (!letterCard) return;

    const isOpen = letterCard.classList.toggle("is-open");
    letterCard.setAttribute("aria-expanded", String(isOpen));
  }

  letterCard?.addEventListener("click", toggleLetter);

  letterCard?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleLetter();
    }
  });

  // Press-and-hold wax seal.
  const waxSeal = document.getElementById("waxSeal");
  const dateReveal = document.getElementById("dateReveal");
  const sealCaption = document.getElementById("sealCaption");

  let holdTimer = null;
  let sealOpened = false;

  function startSeal(event) {
    if (sealOpened || !waxSeal || !dateReveal || !sealCaption) return;

    event.preventDefault();
    waxSeal.classList.add("holding");
    sealCaption.textContent = "Keep holding…";

    try {
      waxSeal.setPointerCapture(event.pointerId);
    } catch (_) {}

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

    if (!sealOpened && sealCaption) {
      sealCaption.textContent = "Press and hold the seal";
    }
  }

  waxSeal?.addEventListener("pointerdown", startSeal);
  waxSeal?.addEventListener("pointerup", cancelSeal);
  waxSeal?.addEventListener("pointercancel", cancelSeal);
  waxSeal?.addEventListener("lostpointercapture", cancelSeal);

  waxSeal?.addEventListener("keydown", (event) => {
    if ((event.key === "Enter" || event.key === " ") && !sealOpened) {
      event.preventDefault();
      if (!dateReveal || !sealCaption) return;

      sealOpened = true;
      waxSeal.classList.add("opened");
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
    } catch (_) {
      updateMusicButton();
    }
  }

  function startMusicOnInteraction(event) {
    if (event.target?.closest?.("#musicToggle")) return;
    playMusic();
  }

  // Try autoplay when the website loads.
  playMusic();

  // If autoplay is blocked, start music on the visitor's first interaction.
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

  // Share invitation.
  const shareButton = document.getElementById("shareButton");

  shareButton?.addEventListener("click", async () => {
    const shareData = {
      title: "Anas & Rabiya | Valima Invitation",
      text: "You are invited to the Valima of Anas & Rabiya on 17 January 2027 at 8:00 PM, The Liberty Ballroom, Karachi.",
      url: location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (_) {}
    } else if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(location.href);
        shareButton.textContent = "LINK COPIED ✓";
        window.setTimeout(() => {
          shareButton.textContent = "SHARE THE INVITATION ↗";
        }, 2000);
      } catch (_) {
        window.prompt("Copy your invitation link:", location.href);
      }
    } else {
      window.prompt("Copy your invitation link:", location.href);
    }
  });
  // Smooth marble background movement while scrolling.
  const marbleSections = document.querySelectorAll(
  ".date-section, .marble-continuation"
);
  let marbleFrame = null;

  function updateMarbleBackground() {
    marbleSections.forEach((section) => {
      const rect = section.getBoundingClientRect();

      const shift = (window.innerHeight * 0.5 - rect.top) * 0.20;

      section.style.setProperty(
        "--marble-shift",
        `${shift}px`
      );
    });

    marbleFrame = null;
  }

  function requestMarbleUpdate() {
    if (marbleFrame !== null) return;

    marbleFrame = requestAnimationFrame(updateMarbleBackground);
  }

  window.addEventListener("scroll", requestMarbleUpdate, {
    passive: true
  });

  window.addEventListener("resize", requestMarbleUpdate);

  updateMarbleBackground();
});

/* SIMPLE FALLING RED ROSE PETALS */
function startRosePetals() {
  const footer = document.querySelector(".footer-section");
  const layer = document.querySelector(".footer-flower-layer");

  if (!footer || !layer) return;

  layer.innerHTML = "";

  for (let i = 0; i < 22; i++) {
    const petal = document.createElement("span");
    petal.className = "rose-petal";

    petal.style.left = Math.random() * 100 + "%";
    petal.style.setProperty("--size", (10 + Math.random() * 9) + "px");
    petal.style.setProperty("--duration", (8 + Math.random() * 6) + "s");
    petal.style.setProperty("--delay", (-Math.random() * 14) + "s");
    petal.style.setProperty("--sway", (20 + Math.random() * 35) + "px");

    layer.appendChild(petal);
  }

  footer.classList.add("is-visible");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startRosePetals);
} else {
  startRosePetals();
}
