// Função para scroll suave com easing
function smoothScrollTo(targetY, duration = 600) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing (easeInOutQuad)
    const ease = progress < 0.5
      ? 2 * progress * progress
      : -1 + (4 - 2 * progress) * progress;

    window.scrollTo(0, startY + distance * ease);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

// Scroll restoration manual + força topo no load
window.history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("#category-buttons button");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.category;

      // Scroll até à secção ou topo
      if (category === "entradas") {
        smoothScrollTo(0);
      } else {
        const section = document.getElementById(`secao-${category}`);
        if (section) {
          const offset = section.getBoundingClientRect().top + window.scrollY;
          const target = Math.min(offset - 80, document.body.scrollHeight - window.innerHeight);
            smoothScrollTo(target);
        }
      }

      // Atualiza botão ativo
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Mover ponto laranja
      const indicator = document.querySelector(".active-indicator");
      const btnRect = btn.getBoundingClientRect();
      const navRect = document.querySelector("#category-buttons").getBoundingClientRect();
      const offset = btnRect.left - navRect.left + btnRect.width / 2 - 4;
      indicator.style.left = `${offset}px`;
    });
  });

  // Posicionar ponto no botão ativo inicial
  const activeBtn = document.querySelector('#category-buttons button.active');
  if (activeBtn) {
    const indicator = document.querySelector(".active-indicator");
    const btnRect = activeBtn.getBoundingClientRect();
    const navRect = document.querySelector("#category-buttons").getBoundingClientRect();
    const offset = btnRect.left - navRect.left + btnRect.width / 2 - 4;
    indicator.style.left = `${offset}px`;
  }
});

// Animação de header ao scroll
let lastScrollY = window.scrollY;
const header = document.getElementById("main-header");

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > lastScrollY && currentScrollY > 50) {
    header.classList.add("collapsed");
  } else {
    header.classList.remove("collapsed");
  }

  lastScrollY = currentScrollY;
});
