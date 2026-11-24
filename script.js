document.addEventListener("DOMContentLoaded", () => {
  const giftScreen = document.getElementById("giftScreen");
  const openButton = document.getElementById("openInvite");
  const invitation = document.getElementById("invitation");
  const curtainHero = document.getElementById("curtainHero");
  const scrollCue = document.getElementById("scrollCue");

  let opening = false;

  // Open invitation after gift box animation
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

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          observeCurtain();
          observeReveals();
        });
      });

    }, 2200);
  });

  // Scroll to letter section
  scrollCue?.addEventListener("click", () => {
    document.querySelector(".letter-section")
      ?.scrollIntoView({ behavior: "smooth" });
  });

  // Reveal sections repeatedly on scroll
  function observeReveals() {
    const sections = document.querySelectorAll("#invitation .reveal");

    if (!("IntersectionObserver" in window)) {
      sections.forEach(section => section.classList.add("visible"));
      return;
    }

    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    }, {
      threshold: 0.15
    });

    sections.forEach(section => revealObserver.observe(section));
  }

  // Curtains open and close according to hero visibility
  function observeCurtain() {
    if (!curtainHero) return;

    if (!("IntersectionObserver" in window)) {
      curtainHero.classList.add("curtains-open");
      return;
    }

    const curtainObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        curtainHero.classList.toggle(
          "curtains-open",
          entry.isIntersecting
        );
      });
    }, {
      threshold: 0.2
    });

    curtainObserver.observe(curtainHero);
  }

  // Letter card interaction
  const letterCard = document.getElementById("letterCard");

  function toggleLetter() {
    if (!letterCard) return;

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

  // Press and hold wax seal
  const waxSeal = document.getElementById("waxSeal");
  const dateReveal = document.getElementById("dateReveal");
  const sealCaption = document.getElementById("sealCaption");

  let holdTimer = null;
  let sealOpened = false;

  function startSeal(event) {
    if (sealOpened || !waxSeal) return;

    event.preventDefault();
    waxSeal.classList.add("holding");

    if (sealCaption) {
      sealCaption.textContent = "Keep holding…";
    }

    try {
      waxSeal.setPointerCapture(event.pointerId);
    } catch (_) {}

    holdTimer = window.setTimeout(() => {
      sealOpened = true;
      waxSeal.classList.remove("holding");
      waxSeal.classList.add("opened");
      dateReveal?.classList.add("revealed");

      if (sealCaption) {
        sealCaption.textContent = "Sealed with love";
      }
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

  waxSeal?.addEventListener("keydown", event => {
    if (
      (event.key === "Enter" || event.key === " ") &&
      !sealOpened
    ) {
      event.preventDefault();
      sealOpened = true;
      dateReveal?.classList.add("revealed");

      if (sealCaption) {
        sealCaption.textContent = "Sealed with love";
      }
    }
  });

  // Countdown: 17 January 2027, 8:00 PM Karachi time
  const eventTime = new Date(
    "2027-01-17T20:00:00+05:00"
  ).getTime();

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

      if (node) {
        node.textContent = String(value).padStart(2, "0");
      }
    });
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  // Background music
  const audio = document.getElementById("backgroundMusic");
  const musicToggle = document.getElementById("musicToggle");
  const musicLabel = document.getElementById("musicLabel");

  musicToggle?.addEventListener("click", async () => {
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();

        if (musicLabel) musicLabel.textContent = "SOUND ON";

        musicToggle.setAttribute(
          "aria-label",
          "Pause background music"
        );
      } catch (error) {
        if (musicLabel) {
          musicLabel.textContent = "AUDIO UNAVAILABLE";
        }
      }
    } else {
      audio.pause();

      if (musicLabel) musicLabel.textContent = "SOUND OFF";

      musicToggle.setAttribute(
        "aria-label",
        "Play background music"
      );
    }
  });

  // Share invitation
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

});
