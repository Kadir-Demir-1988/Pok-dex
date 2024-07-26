function renderStats(i) {
  let detailcontainer = document.getElementById("smalldetails");
  detailcontainer.innerHTML = `
      <canvas id="statsChart" width="400" height="400"></canvas>
    `;
  const stats = pokemonDetails.stats[i];
  const statNames = {
    hp: "HP",
    attack: "Atk",
    defense: "Def",
    "special-attack": "SAtk",
    "special-defense": "SDef",
    speed: "Speed",
  };

  const labels = stats.map(
    (stat) => statNames[stat.name] || upperCase(stat.name)
  );
  const data = stats.map((stat) => stat.value);

  const ctx = document.getElementById("statsChart").getContext("2d");
  const chart = new Chart(ctx, {
    type: "radar",
    data: {
      labels: labels,
      datasets: [
        {
          label: `${upperCase(pokemonDetails.name[i])} Stats`,
          data: data,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        r: {
          beginAtZero: true,
          ticks: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

function renderStatsChart(i) {
  const stats = pokemonDetails.stats[i];

  const labels = stats.map((stat) => upperCase(stat.name));
  const data = stats.map((stat) => stat.value);

  const ctx = document.getElementById("statsChart").getContext("2d");
  const chart = new Chart(ctx, {
    type: "radar", // Typ des Diagramms
    data: {
      labels: labels,
      datasets: [
        {
          label: `${upperCase(pokemonDetails.name[i])} Stats`,
          data: data,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        r: {
          beginAtZero: true,
        },
      },
    },
  });
}
