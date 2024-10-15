export function getStandings(rostersUsers) {
  let standings = [];

  rostersUsers.forEach((league) => {
    league.rosters.forEach((roster) => {
      roster.settings["powerScore"] = roster.settings.wins*200 + roster.settings.fpts;
      standings.push(roster);
    });
  });
  return standings;
}
