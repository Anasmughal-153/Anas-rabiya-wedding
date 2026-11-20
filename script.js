document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");
  const invitation = document.getElementById("invitation");
  const openButton = document.getElementById("openInvite");
  let opened = false;

  // Cinematic zoom-through opening.
  openButton?.addEventListener("click", () => {
    if (opened) return;
    opened = true;
    intro.classList.add("is-opening");
    window.setTimeout(() => {
      intro.hidden = true;
      intro.style.display = "none";
      invitation.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "instant" });
      invitation.querySelectorAll(".reveal").forEach((el, i) => {
        window.setTimeout(() => el.classList.add("visible"), i * 140);
      });
    }, 1050);
  });

  // Scroll reveal for sections.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(el => observer.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add("visible"));
  }

  // Fold / unfold the invitation letter.
  const letterCard = document.getElementById("letterCard");
  letterCard?.addEventListener("click", () => {
    const isOpen = letterCard.classList.toggle("is-open");
    letterCard.setAttribute("aria-expanded", String(isOpen));
  });

  // Scratch-to-reveal date card. Works with mouse, touch and stylus.
  const canvas = document.getElementById("scratchCanvas");
  const scratchCard = document.getElementById("scratchCard");
  const instruction = document.getElementById("scratchInstruction");
  const resetButton = document.getElementById("resetScratch");
  const ctx = canvas?.getContext("2d");
  let scratching = false;
  let scratchedPixels = 0;
  let revealed = false;

  function paintScratchLayer() {
    if (!canvas || !ctx || !scratchCard) return;
    const rect = scratchCard.getBoundingClientRect();
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const w = rect.width, h = rect.height;
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, "#e8d6b8");
    gradient.addColorStop(.5, "#c5a474");
    gradient.addColorStop(1, "#ead9bd");
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(255,248,232,.55)";
    ctx.lineWidth = 1;
    ctx.strokeRect(9, 9, w - 18, h - 18);
    ctx.fillStyle = "#745536";
    ctx.textAlign = "center";
    ctx.font = "600 9px Montserrat, sans-serif";
    ctx.fillText("A LITTLE SURPRISE FOR YOU", w / 2, h * .34);
    ctx.font = "30px Georgia, serif";
    ctx.fillText("❧", w / 2, h * .53);
    ctx.font = "8px Montserrat, sans-serif";
    ctx.fillText("RUB THE FEATHER TO REVEAL", w / 2, h * .68);
    ctx.globalCompositeOperation = "destination-out";
    scratchedPixels = 0;
    revealed = false;
    if (instruction) instruction.style.opacity = "1";
  }

  function scratchAt(event) {
    if (!ctx || !canvas || !scratching || revealed) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
    scratchedPixels += 1;
    if (instruction && scratchedPixels > 3) instruction.style.opacity = ".25";
    if (scratchedPixels > 18) {
      const sample = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clear = 0;
      for (let i = 3; i < sample.length; i += 32) {
        if (sample[i] < 40) clear++;
      }
      const total = sample.length / 32;
      if (clear / total > .38) {
        revealed = true;
        canvas.style.transition = "opacity .7s ease";
        canvas.style.opacity = "0";
        if (instruction) instruction.textContent = "17 JANUARY 2027 · SUNDAY · 8:00 PM";
      }
    }
  }

  if (canvas && ctx) {
    paintScratchLayer();
    canvas.addEventListener("pointerdown", event => {
      scratching = true;
      canvas.setPointerCapture?.(event.pointerId);
      scratchAt(event);
    });
    canvas.addEventListener("pointermove", scratchAt);
    ["pointerup", "pointercancel", "lostpointercapture"].forEach(type => {
      canvas.addEventListener(type, () => { scratching = false; });
    });
    resetButton?.addEventListener("click", () => {
      canvas.style.opacity = "1";
      if (instruction) instruction.textContent = "RUB HERE TO REVEAL";
      paintScratchLayer();
    });
    window.addEventListener("resize", () => {
      if (!revealed) paintScratchLayer();
    });
  }

  // Event time is Karachi local time (UTC+05:00).
  const eventTime = new Date("2027-01-17T20:00:00+05:00").getTime();
  function updateCountdown() {
    const remaining = Math.max(0, eventTime - Date.now());
    const parts = {
      days: Math.floor(remaining / 86400000),
      hours: Math.floor((remaining % 86400000) / 3600000),
      minutes: Math.floor((remaining % 3600000) / 60000),
      seconds: Math.floor((remaining % 60000) / 1000)
    };
    Object.entries(parts).forEach(([id, value]) => {
      const node = document.getElementById(id);
      if (node) node.textContent = String(value).padStart(2, "0");
    });
  }
  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  // Background music: upload your own licensed MP3 as assets/music.mp3.
  const audio = document.getElementById("backgroundMusic");
  const musicToggle = document.getElementById("musicToggle");
  const musicLabel = document.getElementById("musicLabel");
  musicToggle?.addEventListener("click", async () => {
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
        musicToggle.classList.add("playing");
        musicToggle.setAttribute("aria-label", "Pause background music");
        if (musicLabel) musicLabel.textContent = "MUSIC ON";
      } catch (error) {
        if (musicLabel) musicLabel.textContent = "ADD MUSIC FILE";
      }
    } else {
      audio.pause();
      musicToggle.classList.remove("playing");
      musicToggle.setAttribute("aria-label", "Play background music");
      if (musicLabel) musicLabel.textContent = "MUSIC OFF";
    }
  });

  // Share the live invitation link.
  const shareButton = document.getElementById("shareButton");
  shareButton?.addEventListener("click", async () => {
    const shareData = {
      title: "Anas & Rabiya | Valima Invitation",
      text: "You are invited to the Valima of Anas & Rabiya on 17 January 2027 at 8:00 PM, The Liberty Ballroom, Karachi.",
      url: window.location.href
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (error) { /* Share sheet dismissed. */ }
    } else if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        shareButton.innerHTML = "LINK COPIED <span>✓</span>";
        window.setTimeout(() => {
          shareButton.innerHTML = 'SHARE INVITATION <span>↗</span>';
        }, 1800);
      } catch (error) {
        window.prompt("Copy this invitation link:", window.location.href);
      }
    } else {
      window.prompt("Copy this invitation link:", window.location.href);
    }
  });
});
