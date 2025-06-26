import { drawOpponents, allTeams, pots } from "./new-format.js";

let lastDrawnOpponents = null; // Store the last draw result

window.addEventListener("wheel", handleScroll);
window.addEventListener("touchmove", handleScroll);

function handleScroll(event) {
  if (event.deltaY > 0 || (event.touches && event.touches[0] && event.touches[0].clientY > 0)) {
    document.getElementById("welcomeScreen").style.opacity = 0;
    setTimeout(function () {
      document.getElementById("welcomeScreen").style.display = "none";
      document.getElementById("contentContainer").style.display = "block";
    }, 1500);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const drawButton = document.getElementById("draw-button");
  const backButton = document.getElementById("back-button");
  const drawContainer = document.getElementById("drawContainer");

  // Initial display of pots
  for (const [potName, teams] of Object.entries(pots)) {
    drawContainer.appendChild(createPotDisplayTable(potName, teams));
  }

  drawButton.addEventListener("click", () => {
    const opponents = drawOpponents();
    if (Object.keys(opponents).length > 0) {
      lastDrawnOpponents = opponents; // Store the result
      displayDrawnTeams(lastDrawnOpponents); // Display the drawn teams
      drawButton.style.display = "none";
      backButton.style.display = "inline-block";
      drawContainer.style.display = "none"; // Hide pots after draw
      document.getElementById("instruction-text").style.display = "block"; // Show instruction
    }
  });

  backButton.addEventListener("click", () => {
    if (lastDrawnOpponents) { // If a draw has happened, go back to the drawn teams list
      displayDrawnTeams(lastDrawnOpponents);
      drawButton.style.display = "none"; // Keep draw button hidden
      backButton.style.display = "inline-block"; // Keep back button visible
      drawContainer.style.display = "none"; // Keep pots hidden
      document.getElementById("instruction-text").style.display = "block"; // Keep instruction visible
    } else {
      // Fallback: if no draw happened yet, go to initial team selection (shouldn't happen if back button is only shown after draw)
      displayInitialTeamSelection();
      drawButton.style.display = "inline-block";
      backButton.style.display = "none";
      drawContainer.style.display = "block";
      document.getElementById("instruction-text").style.display = "none";
    }
  });

  // Initial view should be the pots, not all teams as cards
  // displayInitialTeamSelection(); // This line is removed as pots are displayed initially
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
    img.src = `images/${teamName.replace(/\s+/g, "_").toLowerCase()}_logo.png`;
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
  container.innerHTML = ""; // Clear everything

  allTeams.forEach(team => {
    const card = createTeamCard(team);
    container.appendChild(card);
  });
}

function displayDrawnTeams(opponents) {
  const container = document.getElementById("drawn-teams-container");
  container.innerHTML = ""; // Clear previous results

  const sortedTeams = Object.keys(opponents).sort();

  for (const team of sortedTeams) {
    const card = createTeamCard(team, () => displayOpponentsForTeam(team, opponents));
    container.appendChild(card);
  }
}

function displayOpponentsForTeam(selectedTeam, allOpponents) {
  const container = document.getElementById("drawn-teams-container");
  container.innerHTML = ""; // Clear the main grid

  const selectedTeamContainer = document.createElement('div');
  selectedTeamContainer.id = 'selected-team-opponents';
  
  const title = document.createElement("h2");
  title.textContent = `${selectedTeam}'s Opponents`;
  selectedTeamContainer.appendChild(title);

  const selectedTeamCard = createTeamCard(selectedTeam);
  selectedTeamCard.id = "selected-team-card";
  selectedTeamContainer.appendChild(selectedTeamCard);

  const opponentsGrid = document.createElement('div');
  opponentsGrid.id = 'opponents-grid';

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
    logo.src = 'images/webicon.png'; // Fallback to a default image
    console.warn(`Logo not found for ${teamName}`);
  };

  const name = document.createElement("p");
  name.textContent = teamName;

  card.appendChild(logo);
  card.appendChild(name);

  return card;
}



