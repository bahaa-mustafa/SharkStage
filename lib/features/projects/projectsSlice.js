import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projects: [],
  projectsLoading: false,
  projectsError: null,
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload;
      state.projectsLoading = false;
      state.projectsError = null;
    },
    setProjectsLoading: (state, action) => {
      state.projectsLoading = action.payload;
    },
    setProjectsError: (state, action) => {
      state.projectsError = action.payload;
      state.projectsLoading = false;
    },
  },
});

export const { setProjects, setProjectsLoading, setProjectsError } =
  projectsSlice.actions;
export default projectsSlice.reducer;
