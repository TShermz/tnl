import "./WeeklyAwards.css";
import { useSelector } from "react-redux";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DeleteIcon from "@mui/icons-material/Delete";
import SportsMmaIcon from "@mui/icons-material/SportsMma";
import { weekly_awards } from "../../util/constants";
import { managers } from "../../util/ManagerInfo";

import { getManagerNames } from "../../util/helpers/sleeper";

function WeeklyAwards({ matchups, rosters, users }) {
  const selectedLeagueName = useSelector(
    (state) => state.general.selectedLeagueName
  );

  const topScore = Math.max(
    ...matchups[selectedLeagueName].map((o) =>
      o.manager1_score > o.manager2_score ? o.manager1_score : o.manager2_score
    )
  );
  const lowestScore = Math.min(
    ...matchups[selectedLeagueName].map((o) =>
      o.manager1_score < o.manager2_score ? o.manager1_score : o.manager2_score
    )
  );

  const biggestBeatdown = Math.max(
    ...matchups[selectedLeagueName].map((o) => o.score_differential)
  );

  let topScoreMatchup = matchups[selectedLeagueName].filter(
    (matchup) =>
      matchup.manager1_score === topScore || matchup.manager2_score === topScore
  );
  let lowestScoreMatchup = matchups[selectedLeagueName].filter(
    (matchup) =>
      matchup.manager1_score === lowestScore ||
      matchup.manager2_score === lowestScore
  );
  let biggestBeatdownMatchup = matchups[selectedLeagueName].filter(
    (matchup) =>
      matchup.score_differential === biggestBeatdown ||
      matchup.score_differential === biggestBeatdown
  );

  let topScoreRosterId =
    topScoreMatchup[0].manager1_score === topScore
      ? topScoreMatchup[0].manager1_roster_id
      : topScoreMatchup[0].manager2_roster_id;
  let lowestScoreRosterId =
    lowestScoreMatchup[0].manager1_score === lowestScore
      ? lowestScoreMatchup[0].manager1_roster_id
      : lowestScoreMatchup[0].manager2_roster_id;
  let biggestBeatdownRosterId1 =
    topScoreMatchup[0].manager1_score === topScore
      ? topScoreMatchup[0].manager1_roster_id
      : topScoreMatchup[0].manager2_roster_id;
  let biggestBeatdownRosterId2 =
    topScoreMatchup[0].manager1_score === topScore
      ? topScoreMatchup[0].manager1_roster_id
      : topScoreMatchup[0].manager2_roster_id;

  let topScoreManagerNames = getManagerNames(rosters, users, topScoreRosterId);
  let lowestScoreManagerNames = getManagerNames(
    rosters,
    users,
    lowestScoreRosterId
  );
  let biggestBeatdownManagerNames1 = getManagerNames(
    rosters,
    users,
    biggestBeatdownMatchup[0].manager1_roster_id
  );

  let biggestBeatdownManagerNames2 = getManagerNames(
    rosters,
    users,
    biggestBeatdownMatchup[0].manager2_roster_id
  );

  return (
    <div className="weeklyAwards">
      <div className="awards">
        <div className="topScore award">
          <AttachMoneyIcon fontSize="large" />

          <div className="awardData">
            <h5>Highest Score</h5>
            {topScore === 0 ? (
              <div>No data available</div>
            ) : (
              <>
                <div className="points"> {topScore} pts</div>
                <div>
                  {topScoreManagerNames.teamName} 
                </div>
                ({topScoreManagerNames.managerName})

              </>
            )}
          </div>
          <AttachMoneyIcon fontSize="large" />

        </div>
        <div className="biggestBeatdown award">
          <SportsMmaIcon fontSize="large" />

          <div className="awardData">
            <h5>Biggest Beatdown</h5>
            {biggestBeatdown === 0 ? (
              <div>No data available</div>
            ) : (
              <>
                <span className="points">
                  +{biggestBeatdown.toFixed(2)} pts{" "}
                </span>
                <div>
                  [{biggestBeatdownMatchup[0].manager1_score} -{" "}
                  {biggestBeatdownMatchup[0].manager2_score}]
                </div>
                <div>
                  {biggestBeatdownManagerNames1.managerName} vs.{" "}
                  {biggestBeatdownManagerNames2.managerName}
                </div>
              </>
            )}
          </div>
          <SportsMmaIcon fontSize="large" />

        </div>
        <div className="lowestScore award">
          <DeleteIcon fontSize="large" />

          <div className="awardData">
            <h5>Lowest Score</h5>
            {lowestScore === 0 ? (
              <div>No data available.</div>
            ) : (
              <>
                <div className="points">{lowestScore} pts</div>
                <div>
                  {lowestScoreManagerNames.teamName} (
                  {lowestScoreManagerNames.managerName})
                </div>
              </>
            )}
          </div>
          <DeleteIcon fontSize="large" />

        </div>
      </div>
    </div>
  );
}

export default WeeklyAwards;
