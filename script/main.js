let allPokemons = [];
let currentPokemon = 1;

function init() {
  loadAPI();
}

async function loadAPI() {
  try {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=20&offset=0`;
    let response = await fetch(url);
    let pokemonData = await response.json();
    allPokemons = pokemonData.results;
    await loadPokemonDetails();
    showPokemonCards();
    console.log(allPokemons);
  } catch (error) {
    console.error("Hat nicht geklappt", error);
  }
}

async function loadPokemonDetails() {
  for (let i = 0; i < allPokemons.length; i++) {
    let response = await fetch(allPokemons[i].url);
    let details = await response.json();
    allPokemons[i].details = details; // Speichern der Details, einschließlich der Bild-URL
  }
}

function showPokemonCards() {
  let content = document.getElementById("pokecards");
  content.innerHTML = "";
  for (let i = 0; i < allPokemons.length; i++) {
    content.innerHTML += `
      <div>
        <h2>${allPokemons[i].name}</h2>
        <div><img class="pokeimg" src="${allPokemons[i].details.sprites.other["official-artwork"].front_default}" alt="${allPokemons[i].name}"></div>
      </div>
    `;
  }
}


