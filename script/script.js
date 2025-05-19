
const dishes = [
  {
    id: "paocommanteiga",
    name: "Pão com Manteiga",
    price: "3,00€",
    image: "assets/images/placeholderDuck.png",
    description: "Pão fresco torrado servido com manteiga derretida."
  },
  {
    id: "sopadelegumes",
    name: "Sopa de Legumes",
    price: "3,50€",
    image: "assets/images/placeholderDuck.png",
    description: "Creme de legumes variados com temperos caseiros."
  },
  {
    id: "hamburguer",
    name: "Hambúrguer",
    price: "9,00€",
    image: "assets/images/placeholderDuck.png",
    description: "Sanduíche de carne grelhada com pão, vegetais e molhos."
  },
  {
    id: "carnedeporcoaalentejana",
    name: "Carne de Porco à Alentejana",
    price: "11,00€",
    image: "assets/images/placeholderDuck.png",
    description: "Carne de porco com amêijoas, batatas fritas e coentros."
  },
  {
    id: "francesinha",
    name: "Francesinha",
    price: "9,50€",
    image: "assets/images/placeholderDuck.png",
    description: "Sanduíche recheada com carnes, queijo e molho picante."
  },
  {
    id: "bacalhaucomnatas",
    name: "Bacalhau com Natas",
    price: "8,50€",
    image: "assets/images/placeholderDuck.png",
    description: "Bacalhau desfiado com batata, natas e queijo gratinado."
  },
  {
    id: "douradagrelhada",
    name: "Dourada Grelhada",
    price: "10,00€",
    image: "assets/images/placeholderDuck.png",
    description: "Dourada fresca grelhada com batatas e legumes salteados."
  },
  {
    id: "salmaocommolhodelimao",
    name: "Salmão com Molho de Limão",
    price: "11,50€",
    image: "assets/images/placeholderDuck.png",
    description: "Filete de salmão grelhado servido com molho leve de limão."
  },
  {
    id: "docedacasa",
    name: "Doce da Casa",
    price: "3,50€",
    image: "assets/images/placeholderDuck.png",
    description: "Camadas de bolacha, natas e leite condensado."
  },
  {
    id: "moussedechocolate",
    name: "Mousse de Chocolate",
    price: "3,00€",
    image: "assets/images/placeholderDuck.png",
    description: "Clássica mousse de chocolate negro caseira."
  },
  {
    id: "tartedemaca",
    name: "Tarte de Maçã",
    price: "3,20€",
    image: "assets/images/placeholderDuck.png",
    description: "Tarte caseira de maçã servida morna com canela."
  }
];


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
    const ease = progress < 0.5
      ? 2 * progress * progress
      : -1 + (4 - 2 * progress) * progress;

    window.scrollTo(0, startY + distance * ease);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      isScrollingProgrammatically = false;
    }
  }

  requestAnimationFrame(step);
}

window.history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("#category-buttons button");
  const indicator = document.querySelector(".active-indicator");
  const sections = document.querySelectorAll("h2[data-category]");
  const header = document.getElementById("main-header");

  function updateIndicatorPosition(activeBtn) {
    if (!activeBtn || !indicator) return;
    const btnRect = activeBtn.getBoundingClientRect();
    const navRect = document.querySelector("#category-buttons").getBoundingClientRect();
    const offset = btnRect.left - navRect.left + btnRect.width / 2 - 4;
    indicator.style.left = `${offset}px`;
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.category;

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

      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      updateIndicatorPosition(btn);
    });
  });

  const activeBtn = document.querySelector('#category-buttons button.active');
  updateIndicatorPosition(activeBtn);

  window.addEventListener("scroll", () => {
    if (isScrollingProgrammatically) return;

    let currentCategory = null;

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const isLast = index === sections.length - 1;
      const reachedBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight;

      if (
        (isLast && (rect.top <= 200 || reachedBottom)) ||
        (!isLast && rect.top <= 150 && rect.bottom > 150)
      ) {
        currentCategory = section.dataset.category;
      }
    });

    if (currentCategory) {
      buttons.forEach(btn => {
        const isActive = btn.dataset.category === currentCategory;
        btn.classList.toggle("active", isActive);
        if (isActive) updateIndicatorPosition(btn);
      });
    }

    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      header.classList.add("collapsed");
    } else {
      header.classList.remove("collapsed");
    }
    lastScrollY = currentScrollY;
  });

  window.addEventListener("resize", () => {
    const activeBtn = document.querySelector('#category-buttons button.active');
    updateIndicatorPosition(activeBtn);
  });

  window.addEventListener("orientationchange", () => {
    setTimeout(() => {
      const activeBtn = document.querySelector('#category-buttons button.active');
      updateIndicatorPosition(activeBtn);
    }, 300);
  });
});

let lastScrollY = window.scrollY;

function disablePageScroll() {
  document.body.style.overflow = 'hidden';
  document.body.addEventListener('touchmove', preventScroll, { passive: false });
}

function enablePageScroll() {
  document.body.style.overflow = '';
  document.body.removeEventListener('touchmove', preventScroll);
}

function preventScroll(e) {
  e.preventDefault();
}

function showDishPopup(dish) {
  const overlay = document.getElementById("dish-popup-overlay");
  const popup = document.getElementById("dish-popup");

  document.getElementById("popup-img").src = dish.image;
  document.getElementById("popup-title").textContent = dish.name;
  document.getElementById("popup-price").textContent = dish.price;
  document.getElementById("popup-description").textContent = dish.description;

  overlay.classList.remove("hidden");
  popup.classList.remove("hidden");

  disablePageScroll();
}

function closeDishPopup() {
  document.getElementById("dish-popup-overlay").classList.add("hidden");
  document.getElementById("dish-popup").classList.add("hidden");

  enablePageScroll();
}

// Ao clicar fora
document.getElementById("dish-popup-overlay").addEventListener("click", closeDishPopup);

document.querySelectorAll(".dish-card").forEach((card, index) => {
  card.addEventListener("click", () => {
    const dish = dishes[index];
    if (dish) {
      showDishPopup(dish);
    }
  });
});

