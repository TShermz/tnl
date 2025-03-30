import { createSlice } from "@reduxjs/toolkit";
import { sleeper_league_ids } from "../../util/constants";

const initialGeneralState = {
  sleeperMatchups: [],
  sleeperPlayoffs: []
};

const matchupsSlice = createSlice({
  name: "matchups",
  initialState: initialGeneralState,
  reducers: {
    setSleeperMatchups(state, action) {
      state.sleeperMatchups = action.payload;
    },
    setSleeperPlayoffs(state, action){
      state.selectedSeason = action.payload;
    }
  },
});

export const matchupsActions = matchupsSlice.actions;
export default matchupsSlice;
