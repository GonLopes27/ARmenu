const dishes = [
    {
        id: "hamburguer", // used in URL
        name: "Hambúrguer",
        price: "8.00€",
        image: "assets/images/hbg.png",
        category: "carne",
        modelGLB: "assets/models/Duck.glb",
        modelUSDZ: "assets/models/Duck.usdz",
        description: "Hambúrguer de carne grelhada com queijo, servido com batatas fritas."
    },
    {
        id: "panados",
        name: "Panados de Pescada",
        price: "8.00€",
        image: "assets/images/pnpe.png",
        category: "peixe",
        modelGLB: "assets/models/Fish.glb",
        modelUSDZ: "assets/models/Fish.usdz",
        description: "Panados dourados de pescada acompanhados de arroz e salada."
    },
    {
        id: "doce",
        name: "Doce da Casa",
        price: "3.50€",
        image: "assets/images/ddc.png",
        category: "sobremesa",
        modelGLB: "assets/models/Doce.glb",
        modelUSDZ: "assets/models/Doce.usdz",
        description: "Sobremesa tradicional feita com bolacha, natas e leite condensado."
    }
];


function renderDishes(category = "all") {
    const container = document.getElementById("dish-container");
    container.innerHTML = "";

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
        <a href="details.html?dish=${dish.id}" class="view-3d-btn">Ver Modelo 3D</a>
      `;
        container.appendChild(card);
    });
}

function filterDishes(category) {
    renderDishes(category);
}

// Load all on page load
window.onload = () => renderDishes();

