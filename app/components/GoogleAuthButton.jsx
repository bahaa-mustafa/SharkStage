"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { useGoogleLogin } from "@react-oauth/google";
import { authenticateWithGoogle } from "@/lib/features/auth/auththunks";
import { setError } from "@/lib/features/auth/authSlice";
import Spinner from "./Spinner";

function GoogleAuthButton({ intent, accountType, className = "" }) {
  const dispatch = useDispatch();
  const globalLoading = useSelector((state) => state.auth.loading);
  const [googleLoading, setGoogleLoading] = useState(false);

  const login = useGoogleLogin({
    flow: "auth-code",
    ux_mode: "popup",
    redirect_uri: "postmessage",
    onSuccess: async ({ code }) => {
      if (!code) {
        setGoogleLoading(false);
        dispatch(setError("Google authentication failed. Try again."));
        return;
      }
      const result = await dispatch(
        authenticateWithGoogle({ code, accountType, intent })
      );

      if (!result?.ok && intent === "signin" && result?.data?.needsAccountType) {
        dispatch(
          setError(
            "لا يوجد حساب مرتبط ببريد جوجل هذا. من فضلك قم بإنشاء حساب جديد واختَر نوع الحساب."
          )
        );
      }
      setGoogleLoading(false);
    },
    onError: () => {
      setGoogleLoading(false);
      dispatch(setError("لم يكتمل تسجيل الدخول بجوجل. حاول مرة أخرى."));
    },
  });

  const handleClick = () => {
    if (globalLoading || googleLoading) return;
    setGoogleLoading(true);
    login();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`cursor-pointer hover:bg-background/5 transition-colors grow border-1 rounded-2xl border-background flex justify-center items-center gap-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      disabled={globalLoading || googleLoading}
    >
      {googleLoading ? (
        <Spinner />
      ) : (
        <>
          <FcGoogle size={24} />
          <span>Google</span>
        </>
      )}
    </button>
  );
}

export default GoogleAuthButton;
