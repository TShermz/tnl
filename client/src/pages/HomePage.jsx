import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import PageContent from "../components/UI/PageContent";
import { sleeper_league_names } from "../util/constants";
import { processAllMatchupsByWeek } from "../util/helpers/matchups";
import { getAllRostersUsers } from "../util/helpers/sleeper";

import WeekSelector from "../components/UI/WeekSelector";
import FilterButtons from "../components/UI/FilterButtons";
import Matchups from "../components/Matchups/Matchups";
import ErrorBlock from "../components/UI/ErrorBlock";
import WeeklyAwards from "../components/WeeklyAwards/WeeklyAwards";

function HomePage() {
  // const dispatch = useDispatch();
  const selectedWeek = useSelector((state) => state.general.selectedWeek);
  const selectedSeason = useSelector((state) => state.general.selectedSeason);
  const selectedLeagueName = useSelector(
    (state) => state.general.selectedLeagueName
  );
  const selectedLeagueId = useSelector(
    (state) => state.general.selectedLeagueId
  );

  const matchups = useQuery({
    queryKey: ["tnl_matchups", selectedWeek, selectedSeason],
    queryFn: () => processAllMatchupsByWeek({ selectedWeek }),
  });

  const rostersUsers = useQuery({
    queryKey: ["rosters-users"],
    queryFn: getAllRostersUsers,
  });

  let content;

  let isLoading = matchups.isLoading || rostersUsers.isLoading;
  let isError = matchups.isError || rostersUsers.isError;

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

  if (matchups.data && rostersUsers.data) {
    let selectedRostersUsers = rostersUsers.data.filter((league) => {
      return selectedLeagueName === league.leagueName;
    });

    // let selectedUsers = users.data.filter((user) => {
    //   return selectedLeagueName === user.league;
    // });

    content = (
      <>
        <WeeklyAwards
          matchups={matchups.data}
          rosters={selectedRostersUsers[0].rosters}
          users={selectedRostersUsers[0].users}
        />

        <Matchups
          matchups={matchups.data}
          rosters={selectedRostersUsers[0].rosters}
          users={selectedRostersUsers[0].users}
        />
      </>
    );
  }

  return (
    <>
      <PageContent>
        <div className="homePage">
          <WeekSelector />
          <FilterButtons
            className="homePageFilters"
            buttons={sleeper_league_names}
          />
          <h3>Weekly Awards</h3>

          {content}
        </div>
      </PageContent>
    </>
  );
}

export default HomePage;
