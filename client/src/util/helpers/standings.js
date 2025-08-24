import { sleeper_league_ids } from "../constants";

export function getStandings({rostersUsers, currentSeason}) {
  let standings = [];
  console.log(currentSeason)

  sleeper_league_ids[currentSeason].forEach((league) => {
    rostersUsers[league.name].rosters.forEach((roster) => {
      roster.settings["powerScore"] = roster.settings.wins*200 + roster.settings.fpts;
      standings.push(roster);
    });
  });

  return standings;
}
