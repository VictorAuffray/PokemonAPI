let pokemonList = [];
let typeList = [];

async function fetchPokemonList() {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
    const data = await response.json();
    pokemonList = data.results;
}

async function fetchTypes() {
    const response = await fetch('https://pokeapi.co/api/v2/type');
    const data = await response.json();
    typeList = data.results;
    const typeFilter = document.getElementById("typeFilter");
    typeList.forEach(type => {
        const option = document.createElement("option");
        option.value = type.name;
        option.textContent = type.name.charAt(0).toUpperCase() + type.name.slice(1);
        typeFilter.appendChild(option);
    });
}

function TypeColor(type) {
    const colors = {
        fire: '#F08030', water: '#6890F0', grass: '#78C850', electric: '#F8D030',
        ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0', ground: '#E0C068',
        flying: '#A890F0', psychic: '#F85888', bug: '#A8B820', rock: '#B8A038',
        ghost: '#705898', dragon: '#7038F8', dark: '#705848', steel: '#B8B8D0',
        fairy: '#EE99AC', normal: '#A8A878'
    };
    return colors[type] || '#68A090';
}

async function PokemonDetails(pokemonName) {
    const resultDiv = document.getElementById("result");
    const detailsDiv = document.getElementById("pokemon-details");

    resultDiv.classList.add("hidden");

    detailsDiv.innerHTML = ""; 

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const data = await response.json();
    const primaryType = data.types[0].type.name;
    const backgroundColor = TypeColor(primaryType);

    const pokemonCard = document.createElement("div");
    pokemonCard.classList.add("pokemon-card");
    pokemonCard.style.background = backgroundColor;

    pokemonCard.innerHTML = `
        <h2>${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h2>
        <img src="${data.sprites.front_default}" alt="${data.name}">
        <p>Type: ${data.types.map(type => type.type.name).join(", ")}</p>
        <p>Poids: ${data.weight / 10} kg</p>
        <p>Taille: ${data.height / 10} m</p>
    `;

    detailsDiv.appendChild(pokemonCard);
}

async function filterByType(type) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";
    resultDiv.classList.remove("hidden"); 

    if (!type) return;

    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    const data = await response.json();
    data.pokemon.forEach(async (p) => {
        const pokemonResponse = await fetch(p.pokemon.url);
        const pokemonData = await pokemonResponse.json();
        
        const suggestionElement = document.createElement("div");
        suggestionElement.classList.add("suggestion");
        suggestionElement.innerHTML = `
            <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
            <span>${pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</span>
        `;
        suggestionElement.onclick = () => PokemonDetails(pokemonData.name);
        resultDiv.appendChild(suggestionElement);
    });
}

document.getElementById("search").addEventListener("input", async () => {
    const searchInput = document.getElementById("search").value.toLowerCase();
    const resultDiv = document.getElementById("result");
    resultDiv.classList.remove("hidden"); 

    resultDiv.innerHTML = "";

    if (searchInput === "") return;
    
    const filteredPokemon = pokemonList.filter(pokemon => pokemon.name.includes(searchInput));
    filteredPokemon.forEach(async (pokemon) => {
        const response = await fetch(pokemon.url);
        const data = await response.json();
        const suggestionElement = document.createElement("div");
        suggestionElement.classList.add("suggestion");
        suggestionElement.innerHTML = `
            <img src="${data.sprites.front_default}" alt="${data.name}">
            <span>${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</span>
        `;
        suggestionElement.onclick = () => PokemonDetails(data.name);
        resultDiv.appendChild(suggestionElement);
    });
});

document.getElementById("typeFilter").addEventListener("change", (event) => {
    filterByType(event.target.value);
});

fetchPokemonList();
fetchTypes();
