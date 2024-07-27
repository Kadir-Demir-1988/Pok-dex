let MAX_POKEMON = 25;
let url = `https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`;
let offset = 0;
let pokemonDetails = {
  name: [],
  id: [],
  img: [],
  type: [],
  ability: [],
  moves: [],
  height: [],
  weight: [],
  stats: [],
};
let currentIndex = 0;

function init() {
  offset = 0;
  loadAPI();
}

async function loadAPI() {
  showLoading();
  try {
    let response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}&offset=${offset}`
    );
    let responseAsJson = await response.json();
    await loadPokemonDetails(responseAsJson.results);
    showPokemonCards();
  } catch (error) {
    console.error("Hat nicht geklappt", error);
  } finally {
    hideLoading();
  }
}

async function loadPokemonDetails(pokemonList) {
  for (let i = 0; i < pokemonList.length; i++) {
    try {
      let response = await fetch(pokemonList[i].url);
      let details = await response.json();
      processPokemonDetails(details);
    } catch (error) {
      console.error("Hat nicht geklappt", error);
    }
  }
}

async function loadmore() {
  offset += MAX_POKEMON;
  showLoading();
  try {
    let response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}&offset=${offset}`
    );
    let responseAsJson = await response.json();
    await loadPokemonDetails(responseAsJson.results);
    showPokemonCards();
  } catch (error) {
    console.error("Hat nicht geklappt", error);
  } finally {
    hideLoading();
  }
}

function upperCase(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function showPokemonCards() {
  let content = document.getElementById("pokecards");
  content.innerHTML = "";
  for (let i = 0; i < pokemonDetails.name.length; i++) {
    let types = pokemonDetails.type[i].split(", ");
    for (let j = 0; j < types.length; j++) {
      types[j] = upperCase(types[j]);
    }
    let primaryTypeClass = cardbgColors(types[0].toLowerCase());
    content.innerHTML += showPokemonCardsHTML(i, types, primaryTypeClass);
  }
  setCardBackgrounds();
}

function showDetails(i) {
  currentIndex = i;
  let overlay = document.getElementById("overlay");
  let detailcontainer = document.getElementById("detailcard");
  overlay.classList.remove("hidden");
  overlay.classList.add("show");
  detailcontainer.classList.remove("hidden");
  detailcontainer.classList.add("show");
  let types = pokemonDetails.type[i].split(", ");
  let primaryTypeClass = cardbgColors(types[0].toLowerCase());
  detailcontainer.innerHTML = showDetailsHTML(i, types, primaryTypeClass);
  renderAbout(i);
}

function next() {
  currentIndex = (currentIndex + 1) % pokemonDetails.name.length;
  showDetails(currentIndex);
}

function previous() {
  currentIndex =
    (currentIndex - 1 + pokemonDetails.name.length) %
    pokemonDetails.name.length;
  showDetails(currentIndex);
}

function renderAbout(i) {
  let detailContent = document.getElementById("smalldetails");
  detailContent.innerHTML = "";
  detailContent.innerHTML = renderAboutHTML(i);
}

function renderMoves(i) {
  let detailContent = document.getElementById("smalldetails");
  let limitedMoves = pokemonDetails.moves[i].slice(0, 4);
  detailContent.innerHTML = "";
  detailContent.innerHTML = `
        <ul class="moves-list">
      ${limitedMoves.map((move) => `<li>${move}</li>`).join("")}
    </ul>
  `;
}

function closeSmallCard() {
  let overlay = document.getElementById("overlay");
  let detailCard = document.getElementById("detailcard");
  overlay.classList.remove("show");
  overlay.classList.add("hidden");
  detailCard.classList.remove("show");
  detailCard.classList.add("hidden");
}

function setCardBackgrounds() {
  for (let i = 0; i < pokemonDetails.name.length; i++) {
    let types = pokemonDetails.type[i];
    let primaryTypeClass = cardbgColors(types[0].toLowerCase());
    let element = document.getElementById(`bgcolor-${i}`);
    if (element) {
      element.classList.add(primaryTypeClass);
    }
  }
}

function showLoading() {
  document.getElementById("loading").classList.remove("hidden");
}

function hideLoading() {
  document.getElementById("loading").classList.add("hidden");
}

function searchPokemon() {
  const searchTerm = document
    .getElementById("search-input")
    .value.toLowerCase();
  const resultsContainer = document.getElementById("search-results");
  if (searchTerm.length < 3) {
    resultsContainer.innerHTML = "";
    resultsContainer.classList.add("hidden");
    return;
  }

  const filteredPokemons = pokemonDetails.name.filter((name) =>
    name.toLowerCase().startsWith(searchTerm)
  );
  displaySearchResults(filteredPokemons);
}

function displaySearchResults(results) {
  const resultsContainer = document.getElementById("search-results");
  resultsContainer.innerHTML = "";
  if (results.length === 0) {
    resultsContainer.innerHTML = "<p>No results found</p>";
    resultsContainer.classList.remove("hidden");
    return;
  }

  results.forEach((result, index) => {
    const pokemonIndex = pokemonDetails.name.indexOf(result);
    const listItem = document.createElement("div");
    listItem.classList.add("search-result-item");
    listItem.innerHTML = `<p>${upperCase(result)} #${
      pokemonDetails.id[pokemonIndex]
    }</p><img src="${
      pokemonDetails.img[pokemonIndex]
    }" alt="${result}" class="result-img">
    `;
    listItem.onclick = () => {
      showDetails(pokemonIndex);
      hideSearchResults();
    };
    resultsContainer.appendChild(listItem);
  });
  resultsContainer.classList.remove("hidden");
}

function hideSearchResults() {
  const resultsContainer = document.getElementById("search-results");
  resultsContainer.innerHTML = "";
  resultsContainer.classList.add("hidden");
}
