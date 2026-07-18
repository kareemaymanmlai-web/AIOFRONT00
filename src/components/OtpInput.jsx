import { useEffect, useRef } from "react";

export function OtpInput({ length = 6, value, onChange, autoFocus = true }) {
  const inputsRef = useRef([]);
  const digits = Array.from({ length }, (_, index) => value[index] || "");

  useEffect(() => {
    if (autoFocus) inputsRef.current[0]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setDigit = (index, digit) => {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join(""));
  };

  const handleChange = (index, event) => {
    const raw = event.target.value.replace(/\D/g, "");
    if (!raw) {
      setDigit(index, "");
      return;
    }
    if (raw.length > 1) {
      const next = digits.slice();
      raw.split("").slice(0, length - index).forEach((char, offset) => { next[index + offset] = char; });
      onChange(next.join(""));
      const target = Math.min(index + raw.length, length - 1);
      inputsRef.current[target]?.focus();
      return;
    }
    setDigit(index, raw);
    if (index < length - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
      setDigit(index - 1, "");
    }
    if (event.key === "ArrowLeft" && index > 0) inputsRef.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < length - 1) inputsRef.current[index + 1]?.focus();
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    onChange(pasted);
    const target = Math.min(pasted.length, length - 1);
    inputsRef.current[target]?.focus();
  };

  return (
    <div className="otp-boxes" dir="ltr">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => { inputsRef.current[index] = element; }}
          className="otp-box-input"
          inputMode="numeric"
          maxLength={1}
          autoComplete="one-time-code"
          value={digit}
          onChange={(event) => handleChange(index, event)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          onFocus={(event) => event.target.select()}
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  );
}
