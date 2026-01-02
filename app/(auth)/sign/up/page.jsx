"use client";
import Link from "next/link";
import {
  Divider,
  IconButton,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import SignInput from "@/app/components/SignInput";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { FaLinkedin } from "react-icons/fa";
import PageTransition from "@/app/components/PageTransition";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/features/auth/auththunks";
import Spinner from "@/app/components/Spinner";
import GoogleAuthButton from "@/app/components/GoogleAuthButton";

export default function SignupPage() {
  const {
    control,
    handleSubmit,
    getValues,
    watch,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      accountType: "investor",
    },
    mode: "onChange",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoggedIn, loading, error } = useSelector((state) => state.auth);
  const accountType = watch("accountType");

  async function myHandleSubmit(data) {
    const { confirmPassword, ...payload } = data;
    await dispatch(registerUser(payload));
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
        className="flex items-center gap-2 border border-background dark:border-background/30 hover:bg-background/5 dark:hover:bg-background/10 transition-colors rounded-2xl px-2 py-1 self-start"
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
          <h2 className="text-3xl font-bold text-center dark:text-background">Create an account</h2>
        </div>
        <div className="flex items-center max-lg:gap-2">
          <span className="w-2/5 dark:text-background">Register as</span>

          <Controller
            name="accountType"
            control={control}
            render={({ field }) => (
              <ToggleButtonGroup
                color="primary"
                exclusive
                {...field}
                onChange={(_, newValue) => {
                  if (newValue) field.onChange(newValue);
                }}
                fullWidth
                sx={{ borderRadius: "1rem" }}
              >
                {["Investor", "Owner"].map((type) => (
                  <ToggleButton
                    key={type}
                    value={type.toLowerCase()}
                    sx={{
                      color: "white",
                      borderColor: "rgba(255,255,255,0.2)",
                      backgroundColor: "rgba(255,255,255,0.01)",
                      textTransform: "none",
                      fontWeight: "500",
                      px: 3,
                      py: 1,
                      "&.Mui-selected": {
                        backgroundColor: "rgba(255,255,255,0.25)",
                        color: "white",
                        borderColor: "rgba(255,255,255,0.4)",
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor: "rgba(255,255,255,0.35)",
                      },
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.15)",
                      },
                    }}
                  >
                    {type}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            )}
          />
        </div>
        <div className="flex gap-4 max-lg:flex-col">
          <SignInput
            text="First name"
            name="firstName"
            control={control}
            autoComplete="given-name"
            rules={{
              required: "First name is required",
              minLength: {
                value: 2,
                message: "First name must be at least 2 characters",
              },
            }}
          />
          <SignInput
            text="Last name"
            name="lastName"
            control={control}
            autoComplete="family-name"
            rules={{
              required: "Last name is required",
              minLength: {
                value: 2,
                message: "Last name must be at least 2 characters",
              },
            }}
          />
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
          name="password"
          text="Password"
          control={control}
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
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
        <SignInput
          name="confirmPassword"
          text="Confirm password"
          control={control}
          type={showConfirmPassword ? "text" : "password"}
          autoComplete="new-password"
          rules={{
            required: "Please confirm your password",
            validate: (value) =>
              value === getValues("password") || "Passwords do not match",
          }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? (
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
          className="text-primary self-stretch flex items-center justify-center cursor-pointer transition-shadow font-medium hover:shadow-lg bg-buttons text-xl py-2 px-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isValid || loading}
        >
          {loading ? (
            <Spinner />
          ) : (
            <>
              <span>Create account</span>
            </>
          )}
        </button>
        {error && (
          <p className="text-center text-red-700 dark:text-red-400 font-bold">
            {typeof error === "string"
              ? error
              : error?.message || "Registration failed. Please try again."}
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
            Or register with
          </Divider>
          <div className="flex justify-between gap-4">
            <GoogleAuthButton intent="signup" accountType={accountType} />
            <div className="cursor-pointer hover:bg-background/5 dark:hover:bg-background/10 transition-colors grow border rounded-2xl border-background dark:border-background/30 flex justify-center items-center gap-4 py-2 dark:text-background">
              <FaLinkedin size={24} />
              <span>LinkedIn</span>
            </div>
          </div>
        </div>
      </form>
      <div className="flex justify-between w-full">
        <h4 className="dark:text-background">
          Have an account?{" "}
          <Link
            href="/sign/in"
            className="text-buttons hover:text-buttons/50 transition-colors font-bold"
          >
            Sign in
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
