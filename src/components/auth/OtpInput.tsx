"use client";

import { useEffect, useRef } from "react";

interface OtpInputProps {
  value: string;
  onChange: (otp: string) => void;
  disabled?: boolean;
  isError?: boolean;
}

export function OtpInput({
  value,
  onChange,
  disabled = false,
  isError = false,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const digits = value.split("").slice(0, 6);
  while (digits.length < 6) {
    digits.push("");
  }

  useEffect(() => {
    // Focus first input on mount if empty
    if (!value && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [value]);

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleChange = (index: number, char: string) => {
    const cleanChar = char.replace(/\D/g, "");
    if (!cleanChar) {
      const newDigits = [...digits];
      newDigits[index] = "";
      onChange(newDigits.join(""));
      return;
    }

    const singleDigit = cleanChar.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = singleDigit;
    const newOtp = newDigits.join("");
    onChange(newOtp);

    // Auto advance to next box
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (pastedData) {
      onChange(pastedData);
      const targetIndex = Math.min(pastedData.length, 5);
      inputRefs.current[targetIndex]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 md:gap-3">
      {digits.map((digit, idx) => (
        <input
          // biome-ignore lint/suspicious/noArrayIndexKey: Fixed 6-digit OTP array
          key={idx}
          ref={(el) => {
            inputRefs.current[idx] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          className={`w-9 h-11 sm:w-11 sm:h-13 md:w-13 md:h-15 text-center text-lg sm:text-xl md:text-2xl font-black rounded-lg sm:rounded-xl border-2 transition-all outline-none ${
            isError
              ? "border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400"
              : digit
                ? "border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/20 text-slate-900 dark:text-slate-100 shadow-xs"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        />
      ))}
    </div>
  );
}
