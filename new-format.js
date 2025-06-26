document.addEventListener("DOMContentLoaded", () => {
  // All teams in the league stage
  const allTeams = [
    // Pot 1
    "Man City",
    "Bayern",
    "Real Madrid",
    "Paris",
    "Liverpool",
    "Internazionale",
    "Dortmund",
    "Leipzig",
    "Barcelona",
    // Pot 2
    "Bayer Leverkusen",
    "Atletico",
    "Atalanta",
    "Juventus",
    "Benfica",
    "Arsenal",
    "Club Brugge",
    "Shakhtar",
    "AC Milan",
    // Pot 3
    "Feyenoord",
    "Sporting CP",
    "PSV",
    "Lille",
    "Dinamo Zagreb",
    "Celtic",
    "Bodo Glimt",
    "Galatasaray",
    "Partizan",
    // Pot 4
    "Slovan Bratislava",
    "Aston Villa",
    "Olympiacos",
    "Crvena zvezda",
    "PAOK",
    "Maccabi Tel Aviv",
    "Ferencvaros",
    "Young Boys",
    "Real Sociedad",
  ];

  // Teams by country
  const teamsByCountry = {
    England: ["Man City", "Liverpool", "Arsenal", "Aston Villa"],
    Germany: ["Bayern", "Dortmund", "Leipzig", "Bayer Leverkusen"],
    Spain: ["Real Madrid", "Barcelona", "Atletico", "Real Sociedad"],
    France: ["Paris", "Lille"],
    Italy: ["Internazionale", "Atalanta", "Juventus", "AC Milan"],
    Portugal: ["Benfica", "Sporting CP"],
    Netherlands: ["PSV", "Feyenoord"],
    Belgium: ["Club Brugge"],
    Ukraine: ["Shakhtar"],
    Croatia: ["Dinamo Zagreb"],
    Scotland: ["Celtic"],
    Norway: ["Bodo Glimt"],
    Turkey: ["Galatasaray"],
    Serbia: ["Partizan", "Crvena zvezda"],
    Slovakia: ["Slovan Bratislava"],
    Greece: ["Olympiacos", "PAOK"],
    Israel: ["Maccabi Tel Aviv"],
    Hungary: ["Ferencvaros"],
    Switzerland: ["Young Boys"],
  };

  // Pots for the draw
  const pots = {
    "POT 1": [
      "Man City",
      "Bayern",
      "Real Madrid",
      "Paris",
      "Liverpool",
      "Internazionale",
      "Dortmund",
      "Leipzig",
      "Barcelona",
    ],
    "POT 2": [
      "Bayer Leverkusen",
      "Atletico",
      "Atalanta",
      "Juventus",
      "Benfica",
      "Arsenal",
      "Club Brugge",
      "Shakhtar",
      "AC Milan",
    ],
    "POT 3": [
      "Feyenoord",
      "Sporting CP",
      "PSV",
      "Lille",
      "Dinamo Zagreb",
      "Celtic",
      "Bodo Glimt",
      "Galatasaray",
      "Partizan",
    ],
    "POT 4": [
      "Slovan Bratislava",
      "Aston Villa",
      "Olympiacos",
      "Crvena zvezda",
      "PAOK",
      "Maccabi Tel Aviv",
      "Ferencvaros",
      "Young Boys",
      "Real Sociedad",
    ],
  };

  let lastDrawnOpponents = null;

  window.addEventListener("wheel", handleScroll);
  window.addEventListener("touchmove", handleScroll);

  function handleScroll(event) {
    const isTouchEvent = event.touches && event.touches.length > 0;
    const isWheelEvent = event.deltaY > 0;

    if (isTouchEvent || isWheelEvent) {
      document.getElementById("welcomeScreen").style.opacity = 0;
      setTimeout(function () {
        document.getElementById("welcomeScreen").style.display = "none";
        document.getElementById("contentContainer").style.display = "block";
      }, 1500);
    }
  }

  const drawButton = document.getElementById("draw-button");
  const backButton = document.getElementById("back-button");
  const drawContainer = document.getElementById("drawContainer");

  for (const [potName, teams] of Object.entries(pots)) {
    drawContainer.appendChild(createPotDisplayTable(potName, teams));
  }

  drawButton.addEventListener("click", () => {
    const opponents = drawOpponents();
    if (Object.keys(opponents).length > 0) {
      lastDrawnOpponents = opponents;
      displayDrawnTeams(lastDrawnOpponents);
      drawButton.style.display = "none";
      backButton.style.display = "inline-block";
      drawContainer.style.display = "none";
      document.getElementById("instruction-text").style.display = "block";
    }
  });

  backButton.addEventListener("click", () => {
    if (lastDrawnOpponents) {
      displayDrawnTeams(lastDrawnOpponents);
      drawButton.style.display = "none";
      backButton.style.display = "inline-block";
      drawContainer.style.display = "none";
      document.getElementById("instruction-text").style.display = "block";
    } else {
      displayInitialTeamSelection();
      drawButton.style.display = "inline-block";
      backButton.style.display = "none";
      drawContainer.style.display = "block";
      document.getElementById("instruction-text").style.display = "none";
    }
  });

  function createPotDisplayTable(potName, teams) {
    const table = document.createElement("table");
    const tableHead = document.createElement("thead");
    const tableBody = document.createElement("tbody");
    const headRow = document.createElement("tr");
    const headCell = document.createElement("td");
    const headSpan = document.createElement("span");
    headSpan.textContent = potName;
    headSpan.id = `${potName.replace(/\s+/g, "-").toLowerCase()}-heading`;
    headCell.appendChild(headSpan);
    headRow.appendChild(headCell);
    tableHead.appendChild(headRow);

    teams.forEach((teamName) => {
      const bodyRow = document.createElement("tr");
      const bodyCell = document.createElement("td");
      const teamContainer = document.createElement("div");
      teamContainer.classList.add("team-container");

      const img = document.createElement("img");
      img.src = `images/${teamName
        .replace(/\s+/g, "_")
        .toLowerCase()}_logo.png`;
      img.alt = `${teamName} Logo`;
      img.classList.add("groups-team-logo");
      img.width = 25;
      img.height = 29;

      const teamNameSpan = document.createElement("span");
      teamNameSpan.textContent = teamName.toUpperCase();
      teamNameSpan.classList.add("team-name");
      teamContainer.appendChild(img);
      teamContainer.appendChild(teamNameSpan);
      bodyCell.appendChild(teamContainer);
      bodyRow.appendChild(bodyCell);
      tableBody.appendChild(bodyRow);
    });

    table.appendChild(tableHead);
    table.appendChild(tableBody);
    return table;
  }

  function displayInitialTeamSelection() {
    const container = document.getElementById("drawn-teams-container");
    container.innerHTML = "";

    allTeams.forEach((team) => {
      const card = createTeamCard(team);
      container.appendChild(card);
    });
  }

  function displayDrawnTeams(opponents) {
    const container = document.getElementById("drawn-teams-container");
    container.innerHTML = "";

    const sortedTeams = Object.keys(opponents).sort();

    for (const team of sortedTeams) {
      const card = createTeamCard(team, () =>
        displayOpponentsForTeam(team, opponents)
      );
      container.appendChild(card);
    }
  }

  function displayOpponentsForTeam(selectedTeam, allOpponents) {
    const container = document.getElementById("drawn-teams-container");
    container.innerHTML = "";

    const selectedTeamContainer = document.createElement("div");
    selectedTeamContainer.id = "selected-team-opponents";

    const title = document.createElement("h2");
    title.textContent = `${selectedTeam}'s Opponents`;
    selectedTeamContainer.appendChild(title);

    const selectedTeamCard = createTeamCard(selectedTeam);
    selectedTeamCard.id = "selected-team-card";
    selectedTeamContainer.appendChild(selectedTeamCard);

    const opponentsGrid = document.createElement("div");
    opponentsGrid.id = "opponents-grid";

    const opponents = allOpponents[selectedTeam].sort();

    opponents.forEach((opponent) => {
      const opponentCard = createTeamCard(opponent);
      opponentsGrid.appendChild(opponentCard);
    });

    selectedTeamContainer.appendChild(opponentsGrid);
    container.appendChild(selectedTeamContainer);
  }

  function createTeamCard(teamName, onClickHandler) {
    const card = document.createElement("div");
    card.className = "team-card";
    if (onClickHandler) {
      card.onclick = onClickHandler;
      card.style.cursor = "pointer";
    }

    const logo = document.createElement("img");
    logo.src = `images/${teamName.toLowerCase().replace(/ /g, "_")}_logo.png`;
    logo.alt = `${teamName} Logo`;
    logo.onerror = () => {
      logo.src = "images/webicon.png";
      console.warn(`Logo not found for ${teamName}`);
    };

    const name = document.createElement("p");
    name.textContent = teamName;

    card.appendChild(logo);
    card.appendChild(name);

    return card;
  }

  function getCountryOfTeam(team) {
    for (const country in teamsByCountry) {
      if (teamsByCountry[country].includes(team)) {
        return country;
      }
    }
    return null;
  }

  function getPotOfTeam(team) {
    for (const potName in pots) {
      if (pots[potName].includes(team)) {
        return potName;
      }
    }
    return null;
  }

  function drawOpponents() {
    let opponents = {};
    let isValidDraw = false;
    let attemptCount = 0;

    while (!isValidDraw) {
      attemptCount++;
      if (attemptCount > 200) {
        console.error(
          "Could not find a valid draw after 200 attempts. There might be an issue with the constraints or data."
        );
        return {};
      }

      opponents = {};
      const teamOpponentPotCounts = {};
      for (const team of allTeams) {
        opponents[team] = [];
        teamOpponentPotCounts[team] = {
          "POT 1": 0,
          "POT 2": 0,
          "POT 3": 0,
          "POT 4": 0,
        };
      }

      const allPossiblePairs = [];
      for (let i = 0; i < allTeams.length; i++) {
        for (let j = i + 1; j < allTeams.length; j++) {
          const teamA = allTeams[i];
          const teamB = allTeams[j];
          if (getCountryOfTeam(teamA) !== getCountryOfTeam(teamB)) {
            allPossiblePairs.push([teamA, teamB]);
          }
        }
      }

      allPossiblePairs.sort(() => Math.random() - 0.5);

      for (const pair of allPossiblePairs) {
        const [teamA, teamB] = pair;
        const potA = getPotOfTeam(teamA);
        const potB = getPotOfTeam(teamB);

        if (
          potA &&
          potB &&
          opponents[teamA].length < 8 &&
          opponents[teamB].length < 8 &&
          teamOpponentPotCounts[teamA][potB] < 2 &&
          teamOpponentPotCounts[teamB][potA] < 2
        ) {
          opponents[teamA].push(teamB);
          opponents[teamB].push(teamA);
          teamOpponentPotCounts[teamA][potB]++;
          teamOpponentPotCounts[teamB][potA]++;
        }
      }

      isValidDraw = true;
      for (const team of allTeams) {
        if (opponents[team].length !== 8) {
          isValidDraw = false;
          break;
        }
      }
    }
    return opponents;
  }
});