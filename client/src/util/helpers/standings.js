export function getStandings(rostersUsers) {
  let standings = [];

  rostersUsers.forEach((league) => {
    league.rosters.forEach((roster) => {
      standings.push(roster);
    });
  });
  return standings;
}
