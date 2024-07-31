function showPokemonCardsHTML(i, types, primaryTypeClass) {
  return `
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

function showDetailsHTML(i, types, primaryTypeClass) {
  return `
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
}

function processPokemonDetails(details) {
  let types = details.types.map((typeInfo) => typeInfo.type.name).join(", ");
  pokemonDetails.name.push(details.name);
  pokemonDetails.id.push(details.id);
  pokemonDetails.img.push(
    details.sprites.other["official-artwork"].front_default
  );
  pokemonDetails.type.push(types);
  outsourcePokemonDet(details);
}

function outsourcePokemonDet(details) {
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
}

function renderAboutHTML(i) {
  return `
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

function outsourceSearchResults(results, resultsContainer) {
  results.forEach((result, index) => {
    const pokemonIndex = pokemonDetails.name.indexOf(result);
    const types = pokemonDetails.type[pokemonIndex].split(", ");
    for (let j = 0; j < types.length; j++) {
      types[j] = upperCase(types[j]);
    }
    const primaryTypeClass = cardbgColors(types[0].toLowerCase());

    const listItem = document.createElement("div");
    listItem.classList.add("search-result-item");
    listItem.innerHTML = `
      <div id="borderid-${pokemonIndex}" class="card borderid ${primaryTypeClass}" data-id="${
      pokemonDetails.id[pokemonIndex]
    }">
        <h2>${upperCase(pokemonDetails.name[pokemonIndex])} #${
      pokemonDetails.id[pokemonIndex]
    }</h2>
        <div id="bgcolor-${pokemonIndex}" class="bgcolor">
          <img onclick="showDetails(${pokemonIndex})" class="pokeimg" src="${
      pokemonDetails.img[pokemonIndex]
    }" alt="${pokemonDetails.name[pokemonIndex]}">
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
    listItem.onclick = () => {
      showDetails(pokemonIndex);
      hideSearchResults();
    };
    resultsContainer.appendChild(listItem);
  });
}
