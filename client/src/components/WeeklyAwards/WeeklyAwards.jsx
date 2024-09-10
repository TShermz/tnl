import "./WeeklyAwards.css";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DeleteIcon from '@mui/icons-material/Delete';
import SportsMmaIcon from "@mui/icons-material/SportsMma";
import { weekly_awards } from "../../util/constants";
import { managers } from "../../util/ManagerInfo";

import { getManagerNames } from "../../util/general";

function WeeklyAwards({ matchups, rosters, users }) {
  const topScore = Math.max(
    ...matchups.matchups.map((o) =>
      o.manager1_score > o.manager2_score ? o.manager1_score : o.manager2_score
    )
  );
  const lowestScore = Math.min(
    ...matchups.matchups.map((o) =>
      o.manager1_score < o.manager2_score ? o.manager1_score : o.manager2_score
    )
  );

  const biggestBeatdown = Math.max(
    ...matchups.matchups.map((o) => o.score_differential)
  );

  let topScoreMatchup = matchups.matchups.filter(
    (matchup) =>
      matchup.manager1_score === topScore || matchup.manager2_score === topScore
  );
  let lowestScoreMatchup = matchups.matchups.filter(
    (matchup) =>
      matchup.manager1_score === lowestScore ||
      matchup.manager2_score === lowestScore
  );
  let biggestBeatdownMatchup = matchups.matchups.filter(
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
  let biggestBeatdownRosterId1 = topScoreMatchup[0].manager1_score === topScore ? topScoreMatchup[0].manager1_roster_id : topScoreMatchup[0].manager2_roster_id;
  let biggestBeatdownRosterId2 = topScoreMatchup[0].manager1_score === topScore ? topScoreMatchup[0].manager1_roster_id : topScoreMatchup[0].manager2_roster_id;

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
      <h3>Weekly Awards</h3>
      <div className="awards">
        <div className="topScore award">
          <AttachMoneyIcon fontSize="large" />

          <div className="awardData">
            <h5>Highest Score</h5>
            <div className="points"> {topScore} pts</div>
            <div>
              {topScoreManagerNames.teamName} (
              {topScoreManagerNames.managerName})
            </div>
          </div>
          <AttachMoneyIcon fontSize="large" />
        </div>
        <div className="biggestBeatdown award">
          <SportsMmaIcon fontSize="large" />

          <div className="awardData">
            <h5>Biggest Beatdown</h5>
            <span className="points">+{biggestBeatdown.toFixed(2)} pts </span> 
            <div>[{biggestBeatdownMatchup[0].manager1_score} - {biggestBeatdownMatchup[0].manager2_score}]</div>
            <div>{biggestBeatdownManagerNames1.managerName} vs. {biggestBeatdownManagerNames2.managerName}</div>
          </div>
          <SportsMmaIcon fontSize="large" />
        </div>
        <div className="lowestScore award">
          <DeleteIcon fontSize="large" />

          <div className="awardData">
            <h5>Lowest Score</h5>
            <div className="points">{lowestScore} pts</div>
            <div>
              {lowestScoreManagerNames.teamName} (
              {lowestScoreManagerNames.managerName})
            </div>
          </div>
          <DeleteIcon fontSize="large" />
        </div>
      </div>
    </div>
  );
}

export default WeeklyAwards;
