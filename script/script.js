let MAX_POKEMON = 25;
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message");

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
      let types = details.types
        .map((typeInfo) => typeInfo.type.name)
        .join(", ");
      pokemonDetails.name.push(details.name);
      pokemonDetails.id.push(details.id);
      pokemonDetails.img.push(
        details.sprites.other["official-artwork"].front_default
      );
      pokemonDetails.type.push(types);
      pokemonDetails.ability.push(
        details.abilities.map((abilityInfo) => abilityInfo.ability.name)
      );
      pokemonDetails.moves.push(
        details.moves.map((moveInfo) => moveInfo.move.name)
      );
      pokemonDetails.height.push(details.height);
      pokemonDetails.weight.push(details.weight);
      pokemonDetails.stats.push(
        details.stats.map((statInfo) => ({
          name: statInfo.stat.name,
          value: statInfo.base_stat,
        }))
      );
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
    content.innerHTML += `
      <div id="borderid-${i}" class="card borderid ${primaryTypeClass}" data-id="${
      pokemonDetails.id[i]
    }">
        <h2>${upperCase(pokemonDetails.name[i])} #${pokemonDetails.id[i]}</h2>
        <div id="bgcolor-${i}" class="bgcolor">
          <img onclick="showDetails(${i})" class="pokeimg" src="${
      pokemonDetails.img[i]
    }" alt="${pokemonDetails.name[i]}">
        </div>
        <div class="typeContainer">
          ${types
            .map(
              (type) =>
                `<div class="typclasses ${TypeColorClass(
                  type.toLowerCase()
                )}">${upperCase(type)}</div>`
            )
            .join("")}
        </div>
      </div>
    `;
  }

  setCardBackgrounds();
}

function showDetails(i) {
  currentIndex = i; // Setze den aktuellen Index
  let overlay = document.getElementById("overlay");
  let detailcontainer = document.getElementById("detailcard");

  overlay.classList.remove("hidden");
  overlay.classList.add("show");

  detailcontainer.classList.remove("hidden");
  detailcontainer.classList.add("show");

  let types = pokemonDetails.type[i].split(", ");
  let primaryTypeClass = cardbgColors(types[0].toLowerCase());
  detailcontainer.innerHTML = `
    <div id="detail-borderid-${i}" class="card borderid ${primaryTypeClass}" data-id="${
    pokemonDetails.id[i]
  }">
      <div class="closex">
        <img onclick="previous()" src="./assets/chevron_left.svg" alt="">
        <button onclick="closeSmallCard()" class="smallx">X</button>
        <img onclick="next()" src="./assets/chevron_right.svg" alt="">
      </div>
      <h2>${upperCase(pokemonDetails.name[i])} #${pokemonDetails.id[i]}</h2>
      <img class="detailimg" src="${pokemonDetails.img[i]}" alt="${
    pokemonDetails.name[i]
  }">
      <div class="typeContainer">
        ${types
          .map(
            (type) =>
              `<div class="typclasses ${TypeColorClass(
                type.toLowerCase()
              )}">${upperCase(type)}</div>`
          )
          .join("")}
      </div>
      <div class="detailbuttons">
        <button onclick="renderAbout(${i})" class="detailbtn">About</button>
        <button onclick="renderMoves(${i})" class="detailbtn">Moves</button>
        <button onclick="renderStats(${i})" class="detailbtn">Stats</button>
      </div>
      <div class="smalldetails" id="smalldetails"></div>
    </div>
  `;
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
  detailContent.innerHTML = `
  <div class="detailwh">
    <div class="height"><img src="./assets/height.svg"> ${
      pokemonDetails.height[i] / 10
    } m</div>
    <div class="weight"><img src="./assets/weight.svg"> ${
      pokemonDetails.weight[i] / 10
    } kg</div>
  </div>  
    <div class="ability">Abilities:</div>
    <ul class="ability-list">
      ${pokemonDetails.ability[i]
        .map((ability) => `<li>${ability}</li>`)
        .join("")}
    </ul>
  `;
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
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const resultsContainer = document.getElementById('search-results');
  
  // Nur suchen, wenn mindestens 3 Buchstaben eingegeben wurden
  if (searchTerm.length < 3) {
    resultsContainer.innerHTML = '';
    resultsContainer.classList.add('hidden'); // Verstecke die Ergebnisse, wenn weniger als 3 Buchstaben eingegeben wurden
    return;
  }

  // Filtere die Pokémon-Liste nach dem Suchbegriff
  const filteredPokemons = pokemonDetails.name.filter(name => name.toLowerCase().startsWith(searchTerm));
  
  // Ergebnisse anzeigen
  displaySearchResults(filteredPokemons);
}

function displaySearchResults(results) {
  const resultsContainer = document.getElementById('search-results');
  resultsContainer.innerHTML = ''; // Vorherige Ergebnisse löschen
  
  if (results.length === 0) {
    resultsContainer.innerHTML = '<p>No results found</p>';
    resultsContainer.classList.remove('hidden'); // Zeige die Ergebnisse auch bei "No results found"
    return;
  }

  // Erstelle eine Liste der Ergebnisse
  results.forEach((result, index) => {
    const pokemonIndex = pokemonDetails.name.indexOf(result);
    const listItem = document.createElement('div');
    listItem.classList.add('search-result-item');
    listItem.innerHTML = `
      <p>${upperCase(result)} #${pokemonDetails.id[pokemonIndex]}</p>
      <img src="${pokemonDetails.img[pokemonIndex]}" alt="${result}" class="result-img">
    `;
    listItem.onclick = () => {
      showDetails(pokemonIndex);
      hideSearchResults();
    };
    resultsContainer.appendChild(listItem);
  });

  resultsContainer.classList.remove('hidden'); // Zeige die Ergebnisse, wenn Suchergebnisse vorhanden sind
}

function hideSearchResults() {
  const resultsContainer = document.getElementById('search-results');
  resultsContainer.innerHTML = ''; // Löscht die Suchergebnisse
  resultsContainer.classList.add('hidden'); // Verstecke die Suchergebnisse
}

console.log(pokemonDetails);
