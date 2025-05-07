const dishes = [
    {
        name: "Hambúrguer",
        price: "8.00€",
        image: "assets/images/hbg.png",
        category: "carne"
    },
    {
        name: "Panados de Pescada",
        price: "8.00€",
        image: "assets/images/pnpe.png",
        category: "peixe"
    },
    {
        name: "Doce da Casa",
        price: "3.50€",
        image: "assets/images/ddc.png",
        category: "sobremesa"
    },

];

function renderDishes(category = "all") {
    const container = document.getElementById("dish-container");
    container.innerHTML = ""; // clear

    const filtered = category === "all"
        ? dishes
        : dishes.filter(d => d.category === category);

    filtered.forEach(dish => {
        const card = document.createElement("div");
        card.className = "dish-card";
        card.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}">
        <h3>${dish.name}</h3>
        <p>${dish.price}</p>
      `;
        container.appendChild(card);
    });
}

function filterDishes(category) {
    renderDishes(category);
}

// Load all on page load
window.onload = () => renderDishes();
