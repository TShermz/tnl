import { managers } from "../ManagerInfo";
import { sleeper_league_ids } from "../constants";

//Get the current state of the NFL Season
export async function getNFLState() {
  const response = await fetch(`https://api.sleeper.app/v1/state/nfl`, {
    method: "GET",
  });

  if (!response.ok) {
    throw json({
      message: "Could not retrieve NFL state.",
      status: 500,
    });
  }

  const nflState = await response.json();

  return nflState;
}

//Queries Sleeper rosters; rosters contain 
export async function getSleeperRosters(leagueId) {
  const url = `https://api.sleeper.app/v1/league/${leagueId}/rosters`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  let rosters = await response.json();
  
  return rosters;
}

//Get users in a league (accessing team name)
export async function getSleeperUsers(leagueId) {
  const url = `https://api.sleeper.app/v1/league/${leagueId}/users`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  let users = await response.json();

  return users;
}

//Queries Sleeper for one week of a league's matchups
export async function getSleeperMatchups(leagueId, week) {
  const url = `https://api.sleeper.app/v1/league/${leagueId}/matchups/${week}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  let matchups = await response.json();
  return matchups;
}

export async function getSleeperPlayoffs(leagueId) {
  const winnersURL = `https://api.sleeper.app/v1/league/${leagueId}/winners_bracket`;
  const winnersResponse = await fetch(winnersURL);

  const losersURL = `https://api.sleeper.app/v1/league/${leagueId}/losers_bracket`;
  const losersResponse = await fetch(losersURL);

  if (!winnersResponse.ok || !losersResponse.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  let winnersBracket = await winnersResponse.json();
  let losersBracket = await losersResponse.json();

  return {winnersBracket, losersBracket};
}


///////  QUERIES WITH LOGIC  /////////////////////////////////////////////////////

//Get Rosters (good for matching roster_id to owner_id)/standings

export async function getAllRostersUsers() {
  let sleeperRostersUsers = {};
  let final = {};

  try {
    for (const league of sleeper_league_ids) {
      let rosters = await getSleeperRosters(league.id);
      let users = await getSleeperUsers(league.id);

      // sleeperRostersUsers.push({ leagueName: league.name, rosters, users });
      sleeperRostersUsers[league.name] = {rosters, users};
    }
    final['2025'] = sleeperRostersUsers;

    return final;
  } catch (error) {
    console.error(error.message);
  }
}

export async function getAllSleeperMatchups () {
  let sleeperMatchups = [];

  try {
    for (const league of sleeper_league_ids){
      let leagueMatchups = [];
      for(let i = 1; i < 15; i++){
        let weekMatchups = await getSleeperMatchups(league.id, i);  
        leagueMatchups.push(weekMatchups)
      }
      sleeperMatchups.push({leagueName: league.name, leagueMatchups});
    }

    return sleeperMatchups;
  } catch (error) {
    console.error(error.message);
  }
}

export async function getAllPlayoffs () {
  let sleeperPlayoffs = [];

  try {
    for (const league of sleeper_league_ids){
      let playoffs = await getSleeperPlayoffs(league.id);
      sleeperPlayoffs.push({leagueName: league.name, playoffs});
    }

    return sleeperPlayoffs;
  } catch (error) {
    console.error(error.message);
  }
}

//HELPER FUNCTION (move to a different file)

export function getManagerNames(rosters, users, owner_id) {
  //finds manager's sleeper roster based on sleeper id
  let managerRoster = rosters.filter((roster) => {
    return roster.roster_id === owner_id;
  });

  //finds local manager's info based on sleeper id
  let localManagerInfo = managers.filter((manager) => {
    return managerRoster[0].owner_id === manager.sleeperID;
  });

  //finds the sleeper user info
  let user = users.filter((user) => {
    return managerRoster[0].owner_id === user.user_id;
  });

  //determines what the team name is
  let teamName = user[0].metadata.team_name
    ? user[0].metadata.team_name
    : `Team ${user[0].display_name}`;

  return { teamName, managerName: localManagerInfo[0].name };
}
