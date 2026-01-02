import api from "@/lib/axios";
import {
  setProjects,
  setProjectsError,
  setProjectsLoading,
} from "./projectsSlice";

export const getProjects = () => async (dispatch) => {
  try {
    dispatch(setProjectsLoading(true));
    const { data } = await api.get("/projects");

    dispatch(setProjects(data.allProjects));
  } catch (err) {
    dispatch(setProjectsError("Network error"));
  } finally {
    dispatch(setProjectsLoading(false));
  }
};
