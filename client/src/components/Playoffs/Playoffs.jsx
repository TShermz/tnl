import "./Playoffs.css";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import Matchup from "../Matchups/Matchup";
import ErrorBlock from "../UI/ErrorBlock";

function Playoffs({ matchups, rosters, users }) {
  const selectedLeagueName = useSelector(
    (state) => state.general.selectedLeagueName
  );
  const selectedLeagueId = useSelector(
    (state) => state.general.selectedLeagueId
  );

  return (
    <>
      <div className="playoffs">
        {/* {matchups[selectedLeagueName].map((matchup) => (
          <Matchup
            key={matchup.matchup_id}
            matchup={matchup}
            rosters={rosters}
            users={users}
          />
        ))} */}
      </div>
    </>
  );
}

export default Playoffs;
