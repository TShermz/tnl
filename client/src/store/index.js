import { configureStore } from "@reduxjs/toolkit";

import generalSlice from "./slices/generalSlice.js";
import matchupsSlice from "./slices/matchupsSlice.js";

const store = configureStore({
  reducer: {
    general: generalSlice.reducer,
    matchups: matchupsSlice.reducer
  },
});

export default store;
