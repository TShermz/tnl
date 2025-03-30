import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import PageContent from "../components/UI/PageContent";
import { sleeper_league_names } from "../util/constants";
import { processAllMatchupsByWeek } from "../util/helpers/matchups";
import { getAllRostersUsers, getSleeperPlayoffs, getAllSleeperMatchups } from "../util/helpers/sleeper";

import WeekSelector from "../components/UI/WeekSelector";
import FilterButtons from "../components/UI/FilterButtons";
import Matchups from "../components/Matchups/Matchups";
import Playoffs from "../components/Playoffs/Playoffs";
import ErrorBlock from "../components/UI/ErrorBlock";
import WeeklyAwards from "../components/WeeklyAwards/WeeklyAwards";

function HomePage() {
  // const dispatch = useDispatch();
  const selectedWeek = useSelector((state) => state.general.selectedWeek);
  const selectedSeason = useSelector((state) => state.general.selectedSeason);
  const selectedLeagueName = useSelector(
    (state) => state.general.selectedLeagueName
  );

  const sleeperMatchups = useQuery({
    queryKey: ["sleeperMatchups"],
    queryFn: getAllSleeperMatchups,
  });
  
  const rostersUsers = useQuery({
    queryKey: ["sleeperRostersUsers"],
    queryFn: getAllRostersUsers,
  });

  let content;

  let isLoading = sleeperMatchups.isLoading || rostersUsers.isLoading;
  let isError = sleeperMatchups.isError || rostersUsers.isError;

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

  if (sleeperMatchups.data && rostersUsers.data) {
    let selectedRostersUsers = rostersUsers.data.filter((league) => {
      return selectedLeagueName === league.leagueName;
    });

    let selectedMatchups = sleeperMatchups.data.filter((league) => {
      return selectedLeagueName === league.leagueName;
    });

    const tnlMatchups = processAllMatchupsByWeek( {selectedMatchups: selectedMatchups[0]} );
    
    //create three separate formats for playoffs in a different component

    content = (
      // <>
      //   {selectedWeek < 15 ? (
      <>
        <h3>Weekly Awards</h3>

        {/* Once the useQuery is instituted, need to select the specific week and year in here */}
        <WeeklyAwards
          matchups={tnlMatchups}
          rosters={selectedRostersUsers[0].rosters}
          users={selectedRostersUsers[0].users}
        />
        <Matchups
          matchups={tnlMatchups}
          rosters={selectedRostersUsers[0].rosters}
          users={selectedRostersUsers[0].users}
        />
      </>
      // ) : (
      //   <Playoffs
      //     matchups={matchups.data}
      //     rosters={selectedRostersUsers[0].rosters}
      //     users={selectedRostersUsers[0].users}
      //   />
      // )}
      // </>
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

          {content}
        </div>
      </PageContent>
    </>
  );
}

export default HomePage;
