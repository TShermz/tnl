import { createSlice } from "@reduxjs/toolkit";
import { sleeper_league_ids } from "../../util/constants";

const initialGeneralState = {
  selectedWeeklyAwards: {},
  selectedLeagueId: "1126967089417269248",
  selectedWeek: null,
  selectedSeason: null,
  selectedMatchups: {}
};

const awardSlice = createSlice({
  name: "award",
  initialState: initialGeneralState,
  reducers: {
    setSelectedWeek(state, action) {
      state.selectedWeek = action.payload;
    },
    setSelectedSeason(state, action){
      state.selectedSeason = action.payload;
    },
    setSelectedLeague(state, action){
      state.selectedLeagueName = action.payload;
      let league = sleeper_league_ids.filter(league =>{return league.name === action.payload});
      state.selectedLeagueId = league[0].id;
    }
  },
});

export const awardActions = awardSlice.actions;
export default awardSlice;
