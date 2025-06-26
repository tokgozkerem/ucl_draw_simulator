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
  "Ferencváros",
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
  Hungary: ["Ferencváros"],
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
    "Ferencváros",
    "Young Boys",
    "Real Sociedad",
  ],
};

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

  // Keep trying until a valid draw is found, with a safeguard
  while (!isValidDraw) {
    attemptCount++;
    // Safeguard to prevent freezing the browser in case of an impossible draw
    if (attemptCount > 200) {
      console.error(
        "Could not find a valid draw after 200 attempts. There might be an issue with the constraints or data."
      );
      return {}; // Return an empty object to indicate failure
    }

    // Initialize data structures for this attempt
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

    // 1. Create a list of all possible valid matchups (no same-country)
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

    // 2. Shuffle the list of matchups to introduce randomness
    allPossiblePairs.sort(() => Math.random() - 0.5);

    // 3. Iterate through the shuffled matchups and assign opponents based on rules
    for (const pair of allPossiblePairs) {
      const [teamA, teamB] = pair;
      const potA = getPotOfTeam(teamA);
      const potB = getPotOfTeam(teamB);

      // Check if the pairing is valid before assigning
      if (
        potA &&
        potB && // Both teams must be in a pot
        opponents[teamA].length < 8 && // Team A needs more opponents
        opponents[teamB].length < 8 && // Team B needs more opponents
        teamOpponentPotCounts[teamA][potB] < 2 && // Team A needs opponent from Team B's pot
        teamOpponentPotCounts[teamB][potA] < 2 // Team B needs opponent from Team A's pot
      ) {
        // Assign the teams to each other
        opponents[teamA].push(teamB);
        opponents[teamB].push(teamA);
        teamOpponentPotCounts[teamA][potB]++;
        teamOpponentPotCounts[teamB][potA]++;
      }
    }

    // 4. Validate the final draw to ensure every team has exactly 8 opponents
    isValidDraw = true;
    for (const team of allTeams) {
      if (opponents[team].length !== 8) {
        isValidDraw = false;
        // console.warn(`Attempt ${attemptCount}: Team ${team} has ${opponents[team].length} opponents. Retrying.`);
        break; // Invalidate and retry the whole process
      }
    }
  }

  // console.log(`Valid draw found after ${attemptCount} attempts!`);
  return opponents;
}

export { allTeams, pots, drawOpponents };
