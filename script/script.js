
const dishes = [
  {
    id: "estrogonofe",
    name: 'Estrogonofe',
    category: 'carne',
    image: './assets/images/EstrogonofeRender.png',
    rating: '4,2',
    price: '12,00€',
    description: 'Estrogonofe de carne com molho cremoso, acompanhado de Arroz e Batata Frita.',
    model: './assets/models/Estrogonofe.glb',
    modelIos: './assets/models/Estrogonofe.usdz'
  },
  {
    id: "cachorro",
    name: 'Cachorro Especial',
    category: 'carne',
    image: './assets/images/CachorroRender.png',
    rating: '3,8',
    price: '8,50€',
    description: 'Cachorro-Quente com molho de Francesinha no Prato.',
    model: './assets/models/Cachorro.glb',
    modelIos: './assets/models/Cachorro.usdz'
  },
  {
    id: "douradinhos",
    name: 'Filetes de Pescada com Arroz',
    category: 'peixe',
    image: './assets/images/DouradinhosRender.png',
    rating: '2,6',
    price: '6,00€',
    description: 'Filetes de Pescada do Capitão Iglo servidos com Arroz.',
    model: './assets/models/DouradinhosClean.glb',
    modelIos: './assets/models/DouradinhosClean.usdz'
  },
  {
    id: "gateau",
    name: 'Petit Gâteau com Gelado',
    category: 'sobremesa',
    image: './assets/images/gateauRender.png',
    rating: '4,7',
    price: '4,00€',
    description: 'Pequeno Bolo de Chocolate e duas bolas de Gelado de Caramelo à parte.',
    model: './assets/models/gateau.glb',
    modelIos: './assets/models/gateau.usdz'
  }
];


let isScrollingProgrammatically = false;
let startY = 0;
let currentY = 0;

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

      if (category === "carne") {
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
    const activeSpan = document.querySelector('.popup-toggle span.active');
    updateIndicatorPosition(activeBtn);
    updateUnderline(activeSpan);
  });

  window.addEventListener("orientationchange", () => {
    setTimeout(() => {
      const activeBtn = document.querySelector('#category-buttons button.active');
      const activeSpan = document.querySelector('.popup-toggle span.active');
      updateIndicatorPosition(activeBtn);
      updateUnderline(activeSpan);
    }, 300);
  });
});

const dishContainer = document.getElementById('dish-container');

function createDishCard(dish) {
  const dishCard = document.createElement('div');
  dishCard.classList.add('dish-card', 'padding-sm');
  dishCard.setAttribute('data-id', dish.id);

  const dishImage = document.createElement('img');
  dishImage.src = dish.image;
  dishImage.alt = dish.name;

  const infoDiv = document.createElement('div');
  infoDiv.classList.add('info');

  const dishTitle = document.createElement('h3');
  dishTitle.classList.add('dish-title');
  dishTitle.textContent = dish.name;

  const ratingPriceDiv = document.createElement('div');
  ratingPriceDiv.classList.add('rating-price');

  const starImg = document.createElement('img');
  starImg.src = 'assets/images/star.png';
  starImg.alt = 'Estrela';
  starImg.classList.add('star');

  const ratingSpan = document.createElement('span');
  ratingSpan.classList.add('rating');
  ratingSpan.textContent = dish.rating;

  const dotCharSpan = document.createElement('span');
  dotCharSpan.classList.add('dot-char');
  dotCharSpan.textContent = '●';

  const priceSpan = document.createElement('span');
  priceSpan.classList.add('price');
  priceSpan.textContent = dish.price;

  ratingPriceDiv.appendChild(starImg);
  ratingPriceDiv.appendChild(ratingSpan);
  ratingPriceDiv.appendChild(dotCharSpan);
  ratingPriceDiv.appendChild(priceSpan);

  const descriptionP = document.createElement('p');
  descriptionP.classList.add('description');
  descriptionP.textContent = dish.description;

  infoDiv.appendChild(dishTitle);
  infoDiv.appendChild(ratingPriceDiv);
  infoDiv.appendChild(descriptionP);

  dishCard.appendChild(dishImage);
  dishCard.appendChild(infoDiv);

  return dishCard;
}

function loadDishesByCategory() {
  const categories = ['carne', 'peixe', 'sobremesa'];

  categories.forEach(category => {
    const sectionTitle = document.createElement('h2');
    sectionTitle.textContent = `Pratos de ${category.charAt(0).toUpperCase() + category.slice(1)}:`;
    sectionTitle.setAttribute('id', `secao-${category}`);
    sectionTitle.setAttribute('data-category', category);

    const sectionDiv = document.createElement('div');
    sectionDiv.classList.add(`category-${category}`);

    const filteredDishes = dishes.filter(dish => dish.category === category);

    filteredDishes.forEach(dish => {
      const dishCard = createDishCard(dish);
      sectionDiv.appendChild(dishCard);
    });

    dishContainer.appendChild(sectionTitle);
    dishContainer.appendChild(sectionDiv);
  });

  const finalSpaceDiv = document.createElement('div');
  finalSpaceDiv.classList.add('final-space');
  dishContainer.appendChild(finalSpaceDiv);
}


loadDishesByCategory();

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

let isPopupOpen = false;

function checkOrientation() {
  if (!isPopupOpen) return;

  if (window.innerWidth > window.innerHeight) {
    enablePageScroll();
  } else {
    disablePageScroll();
  }
}

window.addEventListener('resize', function () {
  checkOrientation();
});

window.addEventListener('orientationchange', function () {
  checkOrientation();
});

const popup = document.getElementById('dish-popup');
const infoPopup = document.getElementById('info-popup');
const overlay = document.getElementById('popup-overlay');
const modelViewer = document.getElementById('popup-3d');
const popupImg = document.getElementById('popup-img');

function openPopup() {
  isPopupOpen = true;
  checkOrientation();

  popup.style.transform = 'translateY(100%)';
  overlay.classList.remove('hidden');

  void popup.offsetWidth;

  popup.style.transition = 'transform 0.4s ease';
  popup.style.transform = 'translateY(0)';
}

function closePopup() {
  isPopupOpen = false;

  popup.style.transition = 'transform 0.4s ease';
  popup.style.transform = 'translateY(100%)';

  overlay.classList.add('hidden');

  const firstSpan = document.querySelector('.popup-toggle span');
  if (!firstSpan.classList.contains('active')) {
    firstSpan.classList.add('active');
  }
  updateUnderline(firstSpan);

  modelViewer.style.display = 'none';
  popupImg.style.display = 'block';

  enablePageScroll();
}

function closeInfoPopup() {
  isPopupOpen = false;

  infoPopup.style.transition = 'transform 0.4s ease';
  infoPopup.style.transform = 'translateX(107.5%)';

  overlay.classList.add('hidden');
  enablePageScroll();
}

function openInfoPopup() {
  isPopupOpen = true;
  checkOrientation();

  infoPopup.classList.remove('hidden');
  overlay.classList.remove('hidden');

  void infoPopup.offsetWidth;

  infoPopup.style.transform = 'translateX(0%)';

}

overlay.addEventListener('click', closePopup);
overlay.addEventListener('click', closeInfoPopup);


let selectedDishId = null;

const toggleSpans = document.querySelectorAll('.popup-toggle span');
const underline = document.querySelector('.toggle-underline');
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

window.addEventListener('load', () => {
  const firstSpan = document.querySelector('.popup-toggle span');
  if (!firstSpan.classList.contains('active')) {
    firstSpan.classList.add('active');
  }
  updateUnderline(firstSpan);
});

function updateUnderline(target) {

  const labelRect = target.getBoundingClientRect();
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

    if (span.textContent === 'Imagem') {
      popupImg.style.display = 'block';
      modelViewer.style.display = 'none';

      modelViewer.removeAttribute('src');
      modelViewer.removeAttribute('ios-src');
    } else {
      popupImg.style.display = 'none';
      modelViewer.style.display = 'block';

      const dish = dishes.find(d => d.id === selectedDishId);

      if (dish) {
        modelViewer.setAttribute('src', dish.model);
        modelViewer.setAttribute('ios-src', dish.modelIos);
      }
    }
  });
});

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

    selectedDishId = card.getAttribute('data-id');

    showDishPopup(selectedDishId);
  });
});

function openDishAR(dishID) {

  if (!dishID) {
    console.error("Nenhum prato selecionado.");
    return;
  }

  const dish = dishes.find(d => d.id === dishID);

  if (dish) {
    const oldViewer = document.getElementById('ar-viewer');
    if (oldViewer) {
      oldViewer.remove();
    }

    const newViewer = document.createElement('model-viewer');
    newViewer.setAttribute('id', 'ar-viewer');
    newViewer.setAttribute('src', dish.model);
    newViewer.setAttribute('ios-src', dish.modelIos);
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
  }
}

document.getElementById('ar-btn').addEventListener('click', () => {

  openDishAR(selectedDishId);

});


function onExitAR() {
  const url = new URL(window.location);
  url.searchParams.delete('prato');

  window.history.replaceState({}, document.title, url.toString());
}

const params = new URLSearchParams(window.location.search);
const QRparam = params.get('prato');

if (QRparam) openDishAR(QRparam);

