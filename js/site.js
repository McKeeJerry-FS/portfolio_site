// Scroll reveal — fade + slide up section content as it enters the viewport,
// fade out when a section leaves.
document.addEventListener("DOMContentLoaded", () => {
  const syncViewportHeight = () => {
    const vh = (window.visualViewport?.height || window.innerHeight) * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  };

  syncViewportHeight();
  window.addEventListener("resize", syncViewportHeight);
  window.addEventListener("orientationchange", syncViewportHeight);
  window.visualViewport?.addEventListener("resize", syncViewportHeight);

  // Improve performance and security for production usage.
  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    link.rel = "noopener noreferrer";
  });

  document.querySelectorAll("img").forEach((img) => {
    if (!img.closest("#home")) {
      img.loading = "lazy";
      img.decoding = "async";
    }
  });

  document.querySelectorAll(".modal img[data-src]").forEach((img) => {
    img.loading = "lazy";
    img.decoding = "async";
  });

  const hydrateDeferredImages = (container) => {
    container.querySelectorAll("img[data-src]").forEach((img) => {
      if (!img.dataset.src) {
        return;
      }

      img.src = img.dataset.src;
      delete img.dataset.src;
    });
  };

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener(
      "show.bs.modal",
      () => {
        hydrateDeferredImages(modal);
      },
      { once: true },
    );
  });

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
