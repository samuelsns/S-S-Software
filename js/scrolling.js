document.addEventListener("DOMContentLoaded", () => {
  const revealEls = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          // Stop observing once revealed to save resources
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15, // Trigger when 15% of the element is visible
      rootMargin: "0px 0px -50px 0px", // Trigger slightly before it hits the viewport
    },
  );

  revealEls.forEach((el) => observer.observe(el));
});
