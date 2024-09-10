import { useSelector } from "react-redux";
import { sleeper_league_ids } from "./constants";
import { managers } from "./ManagerInfo";
import { getSleeperMatchups } from "./general";

export async function processMatchupsByWeek({selectedWeek, selectedLeagueId, selectedLeagueName}) {
  try {
    const results = [];
    let tnlMatchups = [];

    // sleeper_league_ids.forEach(async (league) => {
    let leagueMatchups = [];

    let sleeperMatchups = await getSleeperMatchups(selectedLeagueId, selectedWeek);

    sleeperMatchups.map((matchup) => {
      let result = {
        league_id: selectedLeagueId,
        league_name: selectedLeagueName,
        roster_id: matchup.roster_id,
        matchup_id: matchup.matchup_id,
        points: matchup.points,
        // "max_points": 0, revisit later
        result: "",
      };
      results.push(result);
    });

    //Determine matchup winners
    for (let i = 1; i <= 5; i++) {
      let matchup = calculateMatchupWinners(i, results);
      leagueMatchups.push(matchup);
    }

    return { name: selectedLeagueName, matchups: leagueMatchups };
  } catch (error) {
    console.error(error.message);
  }
}

//calculate the winners of each matchup
export function calculateMatchupWinners(i, results) {
  let players = results.filter((result) => result.matchup_id === i);
  // console.log(matchup);

  let manager1_roster_id = players[0].roster_id;
  let manager2_roster_id = players[1].roster_id;
  let score_differential = players[0].points - players[1].points;

  if (score_differential > 0) {
    results[manager1_roster_id - 1].result = "win";
    results[manager2_roster_id - 1].result = "loss";
  } else if (score_differential < 0) {
    score_differential *= -1;
    results[manager1_roster_id - 1].result = "loss";
    results[manager2_roster_id - 1].result = "win";
  } else {
    results[manager1_roster_id - 1].result = "tie";
    results[manager2_roster_id - 1].result = "tie";
  }

  return {
    matchup_id: players[0].matchup_id,
    manager1_roster_id,
    manager1_score: players[0].points,
    manager1_result: players[0].result,
    manager2_roster_id,
    manager2_score: players[1].points,
    manager2_result: players[1].result,
    score_differential
  };
}
