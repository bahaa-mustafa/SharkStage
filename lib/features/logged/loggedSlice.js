import { createSlice } from "@reduxjs/toolkit";

const initialState = { value: { is: false, user: null } };

const loggedSlice = createSlice({
  name: "logged",
  initialState,
  reducers: {
    loggedIn: (state, action) => {
      state.value.is = true;
      state.value.user = action.payload;
    },
    loggedOut: (state) => {
      state.value.is = false;
      state.value.user = null;
    },
  },
});

export const { loggedIn, loggedOut } = loggedSlice.actions;
export default loggedSlice.reducer;
