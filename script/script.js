
const dishes = [
  {
    id: "estrogonofe",
  name: 'Estrogonofe',
  image: './assets/images/EstrogonofeRender.png',
  rating: '4,5',
  price: '12,00€',
  description: 'Estrogonofe de carne com molho cremoso, acompanhado de arroz e batata palha.',
  model: './assets/models/Estrogonofe.glb',
  modelIos: './assets/models/Estrogonofe.usdz'
  }
];


let isScrollingProgrammatically = false;

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

    window.scrollTo(0, startY + distance * ease)

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
  document.getElementById("popup-rating").textContent = dish.rating;
  document.getElementById("popup-price").textContent = dish.price;
  document.getElementById("popup-description").textContent = dish.description;

  const modelViewer = document.getElementById("popup-3d");
  modelViewer.setAttribute("src", dish.model);
  modelViewer.setAttribute("ios-src", dish.modelIos);

  popup.classList.remove("hidden");
  overlay.classList.remove("hidden");

  openPopup();
  disablePageScroll();
}

function closeDishPopup() {
  document.getElementById("dish-popup-overlay").classList.add("hidden");
  document.getElementById("dish-popup").classList.add("hidden");

  enablePageScroll();
}


document.getElementById("dish-popup-overlay").addEventListener("click", closeDishPopup);

document.querySelectorAll(".dish-card").forEach((card, index) => {
  card.addEventListener("click", () => {
    const dish = dishes[index];
    if (dish) {
      showDishPopup(dish);
    }
  });
});

const popup = document.getElementById('dish-popup');
const overlay = document.getElementById('dish-popup-overlay');
const dragBar = document.querySelector('.popup-drag-bar');

let startY = 0;
let currentY = 0;
let isDragging = false;

function openPopup() {
  popup.classList.remove('closing', 'hidden');
  overlay.classList.remove('hidden');
  void popup.offsetWidth; 
  popup.classList.add('open');
  disablePageScroll();
}

function closePopup() {
  popup.classList.remove('open');
  popup.classList.add('closing');
  enablePageScroll();
  overlay.classList.add('hidden');

  popup.addEventListener('transitionend', () => {
    if (popup.classList.contains('closing')) {
      popup.classList.add('hidden');
      popup.classList.remove('closing');
      popup.style.transform = 'translateX(-50%) translateY(100%)';
    }
  }, { once: true });
}

overlay.addEventListener('click', closePopup);

dragBar.addEventListener('touchstart', e => {
  startY = e.touches[0].clientY;
  isDragging = true;
  popup.style.transition = 'none';
});

dragBar.addEventListener('touchmove', e => {
  if (!isDragging) return;
  currentY = e.touches[0].clientY;
  let deltaY = currentY - startY;
  if (deltaY > 0) {
    popup.style.transform = `translateX(-50%) translateY(${deltaY}px)`;
  }
});

dragBar.addEventListener('touchend', e => {
  if (!isDragging) return;
  isDragging = false;
  popup.style.transition = 'transform 0.3s ease';

  let deltaY = currentY - startY;
  if (deltaY > 100) {
    closePopup();
  } else {
    popup.style.transform = 'translateX(-50%) translateY(0)';
  }
});



const toggleSpans = document.querySelectorAll('.popup-toggle span');
const popupImg = document.getElementById('popup-img');
const modelViewer = document.getElementById('popup-3d');

toggleSpans.forEach((span, index) => {
  span.addEventListener('click', () => {
    toggleSpans.forEach(s => s.classList.remove('active'));
    span.classList.add('active');

    if (index === 0) {
      popupImg.style.display = 'block';
      modelViewer.style.display = 'none';
    } else {
      popupImg.style.display = 'none';
      modelViewer.style.display = 'block';
    }
  });
});


document.getElementById('ar-btn').addEventListener('click', () => {

  const oldViewer = document.getElementById('ar-viewer');
  if (oldViewer) {
    oldViewer.remove();
  }

  const newViewer = document.createElement('model-viewer');
  newViewer.setAttribute('id', 'ar-viewer');
  newViewer.setAttribute('src', 'assets/models/estrogonofe.glb');
  newViewer.setAttribute('ios-src', 'assets/models/estrogonofe.usdz');
  newViewer.setAttribute('ar', '');
  newViewer.setAttribute('ar-modes', 'scene-viewer quick-look webxr');
  newViewer.setAttribute('camera-controls', '');
  newViewer.style.display = 'none';

  document.body.appendChild(newViewer);

  newViewer.addEventListener('load', () => {
    newViewer.activateAR();
  });

  setTimeout(() => {
    newViewer.activateAR();
  }, 100);
});
