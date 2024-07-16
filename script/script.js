let pokemonDetails = {
  name: [],
  id: [],
  img: [],
  type: [],
};

function init() {
  loadAPI();
}

async function loadAPI() {
  try {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=10&offset=0`;
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
    let types = pokemonDetails.type[i].split(', ');
    for (let j = 0; j < types.length; j++) {
      types[j] = upperCase(types[j]);
    }
    content.innerHTML += `
        <div id="borderid">
          <h2>${upperCase(pokemonDetails.name[i])} #${pokemonDetails.id[i]}</h2>
          <div>
            <img class="pokeimg" src="${pokemonDetails.img[i]}" alt="${pokemonDetails.name[i]}">
          </div>
          <div class="typeContainer">
            ${types.map(type => `<div class="${TypeColorClass(type.toLowerCase())}">${type}</div>`).join('')}
          </div>
        </div>
      `;
  }
}

console.log(pokemonDetails);
