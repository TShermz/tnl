import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import PageContent from "../components/UI/PageContent";
import { generalActions } from "../store/slices/generalSlice";
import { sleeper_league_names } from "../util/constants";
import { processMatchupsByWeek } from "../util/matchups";
import { getRosters, getUsers } from "../util/general";

import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import FilterButtons from "../components/UI/FilterButtons";
import Matchups from "../components/Matchups/Matchups";
import ErrorBlock from "../components/UI/ErrorBlock";
import WeeklyAwards from "../components/WeeklyAwards/WeeklyAwards";

function HomePage() {
  const dispatch = useDispatch();
  const selectedWeek = useSelector((state) => state.general.selectedWeek);
  const selectedSeason = useSelector((state) => state.general.selectedSeason);
  const selectedLeagueName = useSelector(
    (state) => state.general.selectedLeagueName
  );
  const selectedLeagueId = useSelector(
    (state) => state.general.selectedLeagueId
  );

  const leftArrowClasses = selectedWeek === 1 ? "hide" : "";
  const rightArrowClasses = selectedWeek === 14 ? "hide" : "";

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

  function adjustWeek(method) {
    dispatch(generalActions.adjustSelectedWeek(method));
  }

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
        <div className="weekSelector">
          <div className="arrows">
            {
              <KeyboardDoubleArrowLeftIcon
                className={leftArrowClasses}
                onClick={() => adjustWeek("decrement")}
                fontSize="large"
              />
            }
          </div>

          <h2>Week {selectedWeek}</h2>
          <div className="arrows">
            <KeyboardDoubleArrowRightIcon
              className={rightArrowClasses}
              onClick={() => adjustWeek("increment")}
              fontSize="large"
            />
          </div>
        </div>
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
