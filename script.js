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
      requestAnimationFrame(() => {
        requestAnimationFrame(() => curtainHero?.classList.add("curtains-open"));
      });
      observeReveals();
    }, 2200);
  });

  scrollCue?.addEventListener("click", () => {
    document.querySelector(".letter-section")?.scrollIntoView({ behavior: "smooth" });
  });

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

// Curtains open when the hero enters view and close when it leaves.
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
