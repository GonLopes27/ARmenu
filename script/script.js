
const dishes = [
  {
    id: "estrogonofe",
    name: 'Estrogonofe',
    image: './assets/images/EstrogonofeRender.png',
    rating: '4,5',
    price: '12,00€',
    description: 'Estrogonofe de carne com molho cremoso, acompanhado de arroz e batata frita.',
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
  document.body.addEventListener('touchmove', preventScroll, { passive: false });
}

function enablePageScroll() {
  document.body.removeEventListener('touchmove', preventScroll);
}

function preventScroll(e) {
  e.preventDefault();
}

function showDishPopup(dishId) {
  const dish = dishes.find(d => d.id === dishId);

  if (dish) {
    const overlay = document.getElementById("popup-overlay");
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

    setTimeout(() => {
      const activeSpan = document.querySelector('.popup-toggle span.active');
      if (activeSpan) updateUnderline(activeSpan);
    }, 50);
  }
}


document.querySelectorAll('.dish-card').forEach(card => {
  card.addEventListener("click", () => {
    const dishId = card.getAttribute('data-id');

    console.log("Prato clicado:", dishId);

    showDishPopup(dishId);
  });
});

const popup = document.getElementById('dish-popup');
const infoPopup = document.getElementById('info-popup')
const overlay = document.getElementById('popup-overlay');

let startY = 0;
let currentY = 0;

function openPopup() {

  popup.style.transform = 'translateY(100%)';
  overlay.classList.remove('hidden');

  void popup.offsetWidth;

  popup.style.transition = 'transform 0.4s ease';
  popup.style.transform = 'translateY(0)';

  disablePageScroll();
}

function closePopup() {
  popup.style.transition = 'transform 0.4s ease';
  popup.style.transform = 'translateY(100%)';

  overlay.classList.add('hidden');

  enablePageScroll();
}

function closeInfoPopup() {
  infoPopup.style.transition = 'transform 0.4s ease';
  infoPopup.style.transform = 'translateX(107.5%)';

  overlay.classList.add('hidden');
  enablePageScroll();
}

function openInfoPopup() {
  infoPopup.classList.remove('hidden');
  overlay.classList.remove('hidden');
  
  void infoPopup.offsetWidth;

  infoPopup.style.transform = 'translateX(0%)';

  infoPopup.classList.add('open');

  disablePageScroll();
}

overlay.addEventListener('click', closePopup);
overlay.addEventListener('click', closeInfoPopup);


const toggleSpans = document.querySelectorAll('.popup-toggle span');
const popupImg = document.getElementById('popup-img');
const modelViewer = document.getElementById('popup-3d');
const infoBtn = document.getElementById('infoBtn')
const closeBtn = document.getElementById('close-info')

infoBtn.addEventListener('click', openInfoPopup);
closeBtn.addEventListener('click', closeInfoPopup);

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
  newViewer.setAttribute('src', 'assets/models/Estrogonofe.glb');
  newViewer.setAttribute('ios-src', 'assets/models/Estrogonofe.usdz');
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

const underline = document.querySelector('.toggle-underline');

window.addEventListener('load', () => {
  const firstSpan = document.querySelector('.popup-toggle span');
  if (!firstSpan.classList.contains('active')) {
    firstSpan.classList.add('active');
  }
  updateUnderline(firstSpan);
});

function updateUnderline(target) {
  const label = target.querySelector('.label');
  const labelRect = label.getBoundingClientRect();
  const parentRect = target.parentElement.getBoundingClientRect();

  const newLeft = labelRect.left - parentRect.left;
  const newWidth = labelRect.width;

  underline.style.left = `${newLeft}px`;
  underline.style.width = `${newWidth}px`;

  underline.style.transform = 'scaleX(0.8)';
  requestAnimationFrame(() => {
    underline.style.transform = 'scaleX(1)';
  });
}

underline.addEventListener('transitionend', (e) => {
  if (e.propertyName === 'transform') {
    const activeSpan = document.querySelector('.popup-toggle span.active');
    const dishId = activeSpan?.textContent.toLowerCase();

    const dish = dishes.find(d => d.id === dishId);

    if (dish && activeSpan?.textContent === '3D') {
      const modelViewer = document.getElementById('popup-3d');
      if (!modelViewer.getAttribute('src')) {
        modelViewer.setAttribute('src', dish.model);
        modelViewer.setAttribute('ios-src', dish.modelIos);
        modelViewer.style.display = 'block';
      }
    }
  }
});

toggleSpans.forEach(span => {
  span.addEventListener('click', () => {
    toggleSpans.forEach(s => s.classList.remove('active'));
    span.classList.add('active');
    updateUnderline(span);

    const popupImg = document.getElementById('popup-img');
    const modelViewer = document.getElementById('popup-3d');

    if (span.textContent === 'Imagem') {
      popupImg.style.display = 'block';
      modelViewer.style.display = 'none';
    } else {
      popupImg.style.display = 'none';
      modelViewer.style.display = 'block';
    }
  });
});


