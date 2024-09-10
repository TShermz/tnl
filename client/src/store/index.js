import { configureStore } from "@reduxjs/toolkit";

import generalSlice from "./slices/generalSlice.js";
import awardSlice from "./slices/awardSlice.js";

const store = configureStore({
  reducer: {
    general: generalSlice.reducer,
    award: awardSlice.reducer
  },
});

export default store;
