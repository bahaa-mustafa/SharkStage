"use client";
import { useEffect, useRef } from "react";
import { Provider, useDispatch } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { makeStore } from "../lib/store";
import { checkAuth } from "@/lib/features/auth/auththunks";
import { getProjects } from "@/lib/features/projects/projectsThunks";
function InitAuth() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
    dispatch(getProjects());
  }, [dispatch]);

  return null;
}
export default function StoreProvider({ children }) {
  const storeRef = useRef(undefined);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <Provider store={storeRef.current}>
        <InitAuth />
        {children}
      </Provider>
    </GoogleOAuthProvider>
  );
}
