// Flag para bloquear scrollspy durante scroll programático
let isScrollingProgrammatically = false;

// Função para scroll suave com easing
function smoothScrollTo(targetY, duration = 600) {
  isScrollingProgrammatically = true;

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
    } else {
      // Libera scrollspy depois da animação
      isScrollingProgrammatically = false;
    }
  }

  requestAnimationFrame(step);
}

// Evita que o browser guarde scroll anterior
window.history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("#category-buttons button");
  const indicator = document.querySelector(".active-indicator");
  const sections = document.querySelectorAll("h2[data-category]");
  const header = document.getElementById("main-header");

  // Clique nos filtros
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.category;

      // Scroll para o topo ou para a secção
      if (category === "entradas") {
        smoothScrollTo(0);
      } else {
        const section = document.getElementById(`secao-${category}`);
        if (section) {
          const offset = section.getBoundingClientRect().top + window.scrollY;
          const target = Math.min(offset - 90, document.body.scrollHeight - window.innerHeight);
          smoothScrollTo(target);
        }
      }

      // Atualiza botão ativo
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Mover ponto laranja
      const btnRect = btn.getBoundingClientRect();
      const navRect = document.querySelector("#category-buttons").getBoundingClientRect();
      const offset = btnRect.left - navRect.left + btnRect.width / 2 - 4;
      indicator.style.left = `${offset}px`;
    });
  });

  // Posição inicial do ponto
  const activeBtn = document.querySelector('#category-buttons button.active');
  if (activeBtn) {
    const btnRect = activeBtn.getBoundingClientRect();
    const navRect = document.querySelector("#category-buttons").getBoundingClientRect();
    const offset = btnRect.left - navRect.left + btnRect.width / 2 - 4;
    indicator.style.left = `${offset}px`;
  }

  // ScrollSpy: atualiza botão e ponto conforme a secção visível
  window.addEventListener("scroll", () => {
    if (isScrollingProgrammatically) return;

    let currentCategory = null;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom > 100) {
        currentCategory = section.dataset.category;
      }
    });

    if (currentCategory) {
      buttons.forEach(btn => {
        const isActive = btn.dataset.category === currentCategory;
        btn.classList.toggle("active", isActive);

        if (isActive) {
          const btnRect = btn.getBoundingClientRect();
          const navRect = document.querySelector("#category-buttons").getBoundingClientRect();
          const offset = btnRect.left - navRect.left + btnRect.width / 2 - 4;
          indicator.style.left = `${offset}px`;
        }
      });
    }

    // Header colapsável
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      header.classList.add("collapsed");
    } else {
      header.classList.remove("collapsed");
    }
    lastScrollY = currentScrollY;
  });
});

let lastScrollY = window.scrollY;
