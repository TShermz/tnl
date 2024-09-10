import "./Matchups.css";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getRosters, getUsers } from "../../util/general";
import { processMatchupsByWeek } from "../../util/matchups";

import Matchup from "./Matchup";
import ErrorBlock from "../UI/ErrorBlock";

function Matchups({ matchups, rosters, users }) {
  const selectedWeek = useSelector((state) => state.general.selectedWeek);
  const selectedSeason = useSelector((state) => state.general.selectedSeason);
  const selectedLeagueName = useSelector(
    (state) => state.general.selectedLeagueName
  );
  const selectedLeagueId = useSelector(
    (state) => state.general.selectedLeagueId
  );

  return (
    <>
      <h3>Matchups</h3>
      <div className="matchups">
        {matchups.matchups.map((matchup) => (
          <Matchup
            key={matchup.matchup_id}
            matchup={matchup}
            rosters={rosters}
            users={users}
          />
        ))}
      </div>
    </>
  );
}

export default Matchups;
