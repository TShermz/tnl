import { Outlet, useLoaderData, useSubmit } from "react-router-dom";
import { useQuery, useQueries } from "@tanstack/react-query";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import MainNavigation from "../components/MainNavigation";

import { getNFLState, getAllRostersUsers, getAllSleeperMatchups, getAllPlayoffs } from "../util/helpers/sleeper";
import { generalActions } from "../store/slices/generalSlice";
import { matchupsActions } from "../store/slices/matchupsSlice";

function RootLayout() {
  const dispatch = useDispatch();

  let content;

  const results = useQueries({
    queries: [
      { queryKey: ["nflState"], queryFn: getNFLState },
      { queryKey: ["sleeperMatchups"], queryFn: getAllSleeperMatchups},
      { queryKey: ["sleeperPlayoffs"], queryFn: getAllPlayoffs },
      { queryKey: ["sleeperRostersUsers"], queryFn: getAllRostersUsers },
    ],
  });

  const isLoading = results.some((result) => result.isLoading);
  const isError = results.some((result) => result.isError);

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

  if (!isLoading) {
    const [nflStateData, sleeperMatchupsData, sleeperPlayoffsData, rostersUsersData] = results.map(
      (result) => result.data
    );

    dispatch(generalActions.setCurrentNFLState(nflStateData));
    dispatch(matchupsActions.setSleeperPlayoffs(sleeperPlayoffsData));

    //create a function for combining rosters, users, and Manager Info
    //dispatch the resulting array of manager data

    //calculate TNL Matchups and Hall of Fame; return an object with Matchups and Hall of Fame
    //dispatch TNL Matchups; dispatch Hall of Fame

    content = (
      <>
        <main>
          <Outlet />
        </main>
      </>
    );
  }

  return (
    <>
      <MainNavigation />

      {content}
    </>
  );
}

export default RootLayout;

