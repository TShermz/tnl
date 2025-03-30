import { createSlice } from "@reduxjs/toolkit";
import { sleeper_league_ids } from "../../util/constants";

const initialGeneralState = {
  selectedLeagueName: "Jabronis",
  currentWeek: null,
  currentSeason: null,
  selectedWeek: null,
  selectedSeason: null,
  selectedMatchups: {},
  selectedWeeklyAwards: [],
};

const generalSlice = createSlice({
  name: "general",
  initialState: initialGeneralState,
  reducers: {
    setCurrentNFLState(state, action){
      state.currentWeek = action.payload.display_week;
      state.currentSeason = action.payload.season;

      //sets selected week to current week upon load
      action.payload.display_week === 0 ? state.selectedWeek = 14 : state.selectedWeek = action.payload;
      state.selectedSeason = action.payload.season;
    },
    setSelectedLeague(state, action) {
      state.selectedLeagueName = action.payload;
      let league = sleeper_league_ids.filter((league) => {
        return league.name === action.payload;
      });
      // state.selectedLeagueId = league[0].id;
    },
    setSelectedWeeklyAwards(state, action) {
      state.selectedWeeklyAwards = action.payload;
    },
    adjustSelectedWeek(state, action) {
      action.payload === "increment"
        ? state.selectedWeek++
        : state.selectedWeek--;
    },
  },
});

export const generalActions = generalSlice.actions;
export default generalSlice;
