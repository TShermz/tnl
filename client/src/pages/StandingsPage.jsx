import "../components/Standings/StandingsTable.css";

import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getAllRostersUsers } from "../util/helpers/sleeper";
import { standingsTableHeaders } from "../util/constants";

import PageContent from "../components/UI/PageContent";
import StandingsTable from "../components/Standings/StandingsTable";
import ErrorBlock from "../components/UI/ErrorBlock";

export default function StandingsPage() {
  const currentSeason = useSelector(
    (state) => state.general.currentSeason
  );

    const rostersUsers = useQuery({
    queryKey: ["rosters-users"],
    queryFn: () => getAllRostersUsers({currentSeason}),
  });

  let content, standings;

  if (rostersUsers.isLoading) {
    content = (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (rostersUsers.isError) {
    content = (
      <div>
        <ErrorBlock
          title="Failed to load message."
          message={error.info?.message || "Error when fetching data."}
        />
      </div>
    );
  }

  if (rostersUsers.data) {
    content = (
      <StandingsTable
        headCells={standingsTableHeaders}
        rostersUsers={rostersUsers.data[currentSeason]}
        currentSeason={currentSeason}
      />
    );
  }

  return (
    <PageContent>
      <h2 className="standingsHeader">Standings (Overall)</h2>
      <p className="scoring-key">
        <span className="equation-highlight">Power Score</span> = Wins * 200 + Points For
      </p>
      {content}
    </PageContent>
  );
}
