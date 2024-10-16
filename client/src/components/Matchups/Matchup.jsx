import { useSelector } from "react-redux";
import { managers } from "../../util/ManagerInfo";
import { getManagerNames } from "../../util/helpers/sleeper";

function Matchup({ matchup, rosters, users }) {
  const selectedLeagueName = useSelector(
    (state) => state.general.selectedLeagueName
  );

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

  let manager1_names = getManagerNames(rosters, users, manager1[0].roster_id);
  let manager2_names = getManagerNames(rosters, users, manager2[0].roster_id);

  return (
    <div className="matchup">
      <div className="manager">
        <div className="ranking">
          {/* <div>#1</div> */}
          <div>
            [{manager1[0].settings.wins}-{manager1[0].settings.losses}]
          </div>
        </div>
        <div className="names">
          <div className="teamName">{manager1_names.teamName}</div>
          <div className="name left">({manager1_names.managerName})</div>
        </div>
        <div className={score1Classes}>{matchup.manager1_score}</div>
      </div>
      <div className="manager">
        <div className={score2Classes}>{matchup.manager2_score}</div>
        <div className="names">
          <div className="teamName">{manager2_names.teamName}</div>
          <div className="name right">({manager2_names.managerName})</div>
        </div>
        <div className="ranking">
          {/* <div>#1</div> */}
          <div>
            [{manager2[0].settings.wins}-{manager2[0].settings.losses}]
          </div>
        </div>
      </div>
    </div>
  );
}

export default Matchup;
