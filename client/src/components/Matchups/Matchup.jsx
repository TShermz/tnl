import { managers } from "../../util/ManagerInfo";
// import {players} from "../../util/players";

function Matchup({ matchup, rosters, users }) {
  //set classes for coloring
  let score1Classes = `score ${matchup.manager1_result}`;
  let score2Classes = `score ${matchup.manager2_result}`;

  //finds two managers in the sleeper roster data
  let manager1 = rosters.filter((roster) => {
    return roster.roster_id === matchup.manager1_roster_id;
  });
  let manager2 = rosters.filter((roster) => {
    return roster.roster_id === matchup.manager2_roster_id;
  });

  //connects two managers from sleeper data to local manager data
  let manager1_info = managers.filter((manager) => {
    return manager1[0].owner_id === manager.sleeperID;
  });
  let manager2_info = managers.filter((manager) => {
    return manager2[0].owner_id === manager.sleeperID;
  });

  //finds two users in the sleeper user data from the previous functions owner_id/user_id
  let user1 = users.filter((user) => {
    return manager1[0].owner_id === user.user_id;
  });
  let user2 = users.filter((user) => {
    return manager2[0].owner_id === user.user_id;
  });

  let teamName1 = user1[0].metadata.team_name
    ? user1[0].metadata.team_name
    : `Team ${user1[0].display_name}`;
  let teamName2 = user2[0].metadata.team_name
    ? user2[0].metadata.team_name
    : `Team ${user2[0].display_name}`;

    console.log(manager1[0]);

    return (
    <div className="matchup">
      <div className="manager">
        <div className="ranking">
          {/* <div>#1</div> */}
          <div>[{manager1[0].settings.wins}-{manager1[0].settings.losses}]</div>
        </div>
        <div className="names">
          <div className="teamName">{teamName1}</div>
          <div className="name left">({manager1_info[0].name})</div>
        </div>
        <div className={score1Classes}>{matchup.manager1_score}</div>
      </div>
      <div className="divider"></div>
      <div className="manager">
        <div className={score2Classes}>{matchup.manager2_score}</div>
        <div className="names">
          <div className="teamName">{teamName2}</div>
          <div className="name right">({manager2_info[0].name})</div>
        </div>
        <div className="ranking">
          {/* <div>#1</div> */}
          <div>[{manager2[0].settings.wins}-{manager2[0].settings.losses}]</div>
        </div>
      </div>
    </div>
  );
}

export default Matchup;
