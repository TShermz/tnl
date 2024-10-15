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

//Get users in a league (accessing team name)
export async function getUsers(leagueId) {
  const url = `https://api.sleeper.app/v1/league/${leagueId}/users`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  let users = await response.json();

  return users;
}

//Get Rosters (good for matching roster_id to owner_id)/standings
export async function getRosters(leagueId) {
  const url = `https://api.sleeper.app/v1/league/${leagueId}/rosters`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  let rosters = await response.json();
  
  return rosters;
}

export async function getAllRostersUsers() {
  let sleeperRostersUsers = [];

  try {
    for (const league of sleeper_league_ids) {
      let rosters = await getRosters(league.id);
      let users = await getUsers(league.id);

      sleeperRostersUsers.push({ leagueName: league.name, rosters, users });
    }

    return sleeperRostersUsers;
  } catch (error) {
    console.error(error.message);
  }
}

//gets one league's matchups for one week
export async function getSleeperMatchups(leagueId, week) {
  const url = `https://api.sleeper.app/v1/league/${leagueId}/matchups/${week}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  let matchups = await response.json();
  return matchups;
}

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
