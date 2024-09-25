import { Outlet, useLoaderData, useSubmit } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import MainNavigation from "../components/MainNavigation";

import { getNFLState } from "../util/sleeper";
import { generalActions } from "../store/slices/generalSlice";

function RootLayout() {
  // const token = useLoaderData();
  const dispatch = useDispatch();

  let content;

  const nflState = useQuery({
    queryKey: ["nflState"],
    queryFn: getNFLState,
  });

  if (nflState.isLoading) {
    content = (
      <div>
        <p>Loading...</p>
      </div>
    );
  };

  if (nflState.isError) {
    content = (
      <div>
        <ErrorBlock
          title="Failed to load message."
          message={error.info?.message || "Error when fetching data."}
        />
      </div>
    );
  };

  if (nflState.data) {
    dispatch(generalActions.setSelectedWeek(nflState.data.display_week));
    dispatch(generalActions.setSelectedSeason(nflState.data.season));

    content = (
      <>
        <MainNavigation />
        <main>
          {/* {navigation.state === 'loading' && <p>Loading...</p>} */}
          <Outlet />
        </main>
      </>
    );
  }

  // useEffect(() => {
  //   if (!token) {
  //     return;
  //   }

  //   if(token === 'EXPIRED'){
  //     submit(null, {action:'/logout', method: 'POST'})
  //   }

  // }, [token, submit]);

  return content;
}

export default RootLayout;
