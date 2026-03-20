// Scroll reveal — fade + slide up section content as it enters the viewport,
// fade out when a section leaves.
document.addEventListener("DOMContentLoaded", () => {
  // Tag each section-page itself as the reveal target so we can fade it as a unit
  document.querySelectorAll(".section-page").forEach((section, i) => {
    section.classList.add("scroll-reveal");
    // Stagger each section's entrance slightly
    section.dataset.revealDelay = `${i * 0.05}s`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        const delay = el.dataset.revealDelay || "0s";

        if (entry.isIntersecting) {
          // Cancel any outgoing fade, then reveal
          el.classList.remove("is-leaving");
          el.style.animationDelay = delay;
          el.classList.add("is-visible");
        } else if (el.classList.contains("is-visible")) {
          // Only fade out sections that have already been revealed
          el.classList.remove("is-visible");
          el.style.animationDelay = "0s";
          el.classList.add("is-leaving");
        }
      });
    },
    {
      threshold: 0.12,
    },
  );

  document
    .querySelectorAll(".scroll-reveal")
    .forEach((el) => observer.observe(el));
});
