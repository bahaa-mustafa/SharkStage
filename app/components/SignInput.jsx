"use client";
import React from "react";
import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";

function SignInput({
  name,
  rules,
  control,
  text,
  type = "text",
  slotProps,
  autoComplete,
}) {
  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          error={!!error}
          label={text}
          variant="outlined"
          type={type}
          slotProps={slotProps}
          helperText={error?.message}
          fullWidth
          autoComplete={autoComplete}
          sx={{
            // Target the root OutlinedInput element
            "& .MuiOutlinedInput-root": {
              borderRadius: "1rem",
              // Default border
              "& fieldset": {
                borderColor: "var(--color-background)",
              },
              // Focused border
              "&.Mui-focused fieldset": {
                borderColor: "var(--color-background)",
              },
            },

            // Label color
            "& .MuiInputLabel-root": {
              color: "var(--color-background)",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "var(--color-background)",
            },
            // Text color inside input
            "& input": {
              color: "var(--color-background)",
            },
            "& input:-webkit-autofill": {
              WebkitBoxShadow: "0 0 0 1000px transparent inset", // visually transparent
              WebkitTextFillColor: "var(--color-background)",
              caretColor: "inherit",
              transition: "background-color 9999s ease-out 0s",
            },
            "& input:-webkit-autofill:focus": {
              WebkitBoxShadow: "0 0 0 1000px transparent inset",
              WebkitTextFillColor: "var(--color-background)",
              caretColor: "inherit",
            },
          }}
        />
      )}
    />
  );
}

export default SignInput;
