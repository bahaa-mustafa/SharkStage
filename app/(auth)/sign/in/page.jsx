"use client";
import Link from "next/link";
import LoginIcon from "@mui/icons-material/Login";
import { Divider, IconButton, InputAdornment } from "@mui/material";
import SignInput from "@/app/components/SignInput";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { FaLinkedin } from "react-icons/fa";
import PageTransition from "@/app/components/PageTransition";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/features/auth/auththunks";
import Spinner from "@/app/components/Spinner";
import GoogleAuthButton from "@/app/components/GoogleAuthButton";

export default function SigninPage() {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });
  const { isLoggedIn, loading, error } = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  async function myHandleSubmit(data) {
    await dispatch(loginUser(data));
  }

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);
  return (
    <PageTransition>
      <Link
        href="/"
        className="flex items-center gap-2 border-1 border-background dark:border-background/30 hover:bg-background/5 dark:hover:bg-background/10 transition-colors rounded-2xl px-2 py-1 self-start"
      >
        <span className="w-8">
          <img className="w-full" src="../logo-white.png" alt="" />
        </span>
        <span className="dark:text-background">SharkStage</span>
      </Link>
      <form
        className="flex flex-col gap-6 w-8/10"
        onSubmit={handleSubmit(myHandleSubmit)}
      >
        <div>
          <h2 className="text-3xl font-bold text-center dark:text-background">
            Sign in to your account
          </h2>
        </div>
        <SignInput
          text="Email address"
          name="email"
          control={control}
          autoComplete="email"
          rules={{
            required: "Email address is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          }}
        />
        <SignInput
          text="Password"
          name="password"
          control={control}
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          rules={{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOff
                        sx={{ color: "var(--color-background)" }}
                      />
                    ) : (
                      <Visibility sx={{ color: "var(--color-background)" }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <button
          className="text-primary gap-2 self-stretch flex items-center justify-center cursor-pointer transition-shadow font-medium hover:shadow-lg bg-buttons text-xl py-2 px-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isValid || loading}
        >
          {loading ? (
            <Spinner />
          ) : (
            <>
              <span>Continue</span> <LoginIcon />
            </>
          )}
        </button>
        {error && (
          <p className="text-center text-red-700 dark:text-red-400 font-bold">
            {typeof error === "string" ? error : "Invalid email or password"}
          </p>
        )}
        <div className="flex flex-col gap-4">
          <Divider
            sx={{
              "&::before, &::after": {
                borderColor: "var(--color-background)",
              },
            }}
          >
            Or login with
          </Divider>
          <div className="flex justify-between gap-4">
            <GoogleAuthButton intent="signin" />
            <div className="cursor-pointer hover:bg-background/5 dark:hover:bg-background/10 transition-colors grow border-1 rounded-2xl border-background dark:border-background/30 flex justify-center items-center gap-4 py-2 dark:text-background">
              <FaLinkedin size={24} />
              <span>LinkedIn</span>
            </div>
          </div>
        </div>
      </form>
      <div className="flex max-lg:flex-col max-lg:gap-2 max-lg:items-center justify-between w-full">
        <h4 className="dark:text-background">
          Don't have an account?{" "}
          <Link
            href="/sign/up"
            className="text-buttons hover:text-buttons/50 transition-colors font-bold"
          >
            Create one
          </Link>
        </h4>
        <Link
          href="#"
          className="text-buttons hover:text-buttons/50 transition-colors font-bold"
        >
          Terms&Conditions
        </Link>
      </div>
    </PageTransition>
  );
}
