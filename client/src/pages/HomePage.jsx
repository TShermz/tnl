import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import PageContent from "../components/UI/PageContent";
import { generalActions } from "../store/slices/generalSlice";
import { sleeper_league_names } from "../util/constants";
import { processMatchupsByWeek } from "../util/matchups";
import { getRosters, getUsers } from "../util/general";

import FilterButtons from "../components/UI/FilterButtons";
import Matchups from "../components/Matchups/Matchups";
import ErrorBlock from "../components/UI/ErrorBlock";
import WeeklyAwards from "../components/WeeklyAwards/WeeklyAwards";

function HomePage() {
  const selectedWeek = useSelector((state) => state.general.selectedWeek);
  const selectedSeason = useSelector((state) => state.general.selectedSeason);
  const selectedLeagueName = useSelector(
    (state) => state.general.selectedLeagueName
  );
  const selectedLeagueId = useSelector(
    (state) => state.general.selectedLeagueId
  );

  const matchups = useQuery({
    queryKey: [
      "tnl_matchups",
      selectedWeek,
      selectedSeason,
      selectedLeagueName,
    ],
    queryFn: () =>
      processMatchupsByWeek({
        selectedWeek,
        selectedLeagueId,
        selectedLeagueName,
      }),
  });

  const rosters = useQuery({
    queryKey: ["rosters", selectedLeagueName],
    queryFn: () => getRosters({ leagueId: selectedLeagueId }),
  });

  const users = useQuery({
    queryKey: ["users", selectedLeagueName],
    queryFn: () => getUsers({ leagueId: selectedLeagueId }),
  });

  let content;

  let isLoading = matchups.isLoading || rosters.isLoading || users.isLoading;
  let isError = matchups.isError || rosters.isError || users.isError;

  if (isLoading) {
    content = (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (isError) {
    content = (
      <div>
        <ErrorBlock
          title="Failed to load message."
          message={error.info?.message || "Error when fetching data."}
        />
      </div>
    );
  }

  if (matchups.data && rosters.data && users.data) {
    content = (
      <div className="homePage">
        <h2>Week {selectedWeek}</h2>
        <FilterButtons
          className="homePageFilters"
          buttons={sleeper_league_names}
        />
        <WeeklyAwards
          matchups={matchups.data}
          rosters={rosters.data}
          users={users.data}
        />

        <Matchups
          matchups={matchups.data}
          rosters={rosters.data}
          users={users.data}
        />
      </div>
    );
  }

  return (
    <>
      <PageContent>{content}</PageContent>
    </>
  );
}

export default HomePage;
