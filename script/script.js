let MAX_POKEMON = 3;
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message");

let url = `https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`;

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

function init() {
  loadAPI();
}

async function loadAPI() {
  try {
    let response = await fetch(url);
    let responseAsJson = await response.json();
    await loadPokemonDetails(responseAsJson.results);
    showPokemonCards();
  } catch (error) {
    console.error("Hat nicht geklappt", error);
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
    }">
        </div>
        <div class="typeContainer">
          ${types
            .map(
              (type) =>
                `<div class="typclasses ${TypeColorClass(
                  type.toLowerCase()
                )}">${type}</div>`
            )
            .join("")}
        </div>
      </div>
    `;
  }

  setCardBackgrounds();
}

function showDetails(i) {
  let detailcontainer = document.getElementById("detailcard");
  detailcontainer.classList.remove("hidden");
  let types = pokemonDetails.type[i].split(", ");
  let primaryTypeClass = cardbgColors(types[0].toLowerCase());
  detailcontainer.innerHTML = `<div id="detail-borderid-${i}" class="card borderid ${primaryTypeClass}" data-id="${
    pokemonDetails.id[i]
  }">
      <div class="closex">
      <img src="./assets/chevron_left.svg" alt="">
      <button onclick="closeSmallCard()" class="smallx">X</button>
      <img src="./assets/chevron_right.svg" alt=""></div>
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
  </div>`;
  renderAbout(i);
}

function renderAbout(i) {
  let detailContent = document.getElementById("smalldetails");
  detailContent.innerHTML = "";
  detailContent.innerHTML = `
    <p>Höhe: ${pokemonDetails.height[i]}</p>
    <p>Gewicht: ${pokemonDetails.weight[i]}</p>
    <p>Fähigkeiten: ${pokemonDetails.ability[i].join(", ")}</p>
  `;
}

function renderMoves(i) {
  let detailContent = document.getElementById("smalldetails");
  let limitedMoves = pokemonDetails.moves[i].slice(0, 4);
  detailContent.innerHTML = "";
  detailContent.innerHTML = `
    <div>Moves: ${limitedMoves.join(", ")}</div>
  `;
}

function renderStats(i) {
  let detailcontainer = document.getElementById("smalldetails");
  detailcontainer.innerHTML = "";
  detailcontainer.innerHTML = `
  <div>Stats: ${pokemonDetails.stats[i]
    .map((stat) => `${stat.name}: ${stat.value}`)
    .join(", ")}</div>
  `;
}

function closeSmallCard() {
  let detailCard = document.getElementById("detailcard");

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

console.log(pokemonDetails);
