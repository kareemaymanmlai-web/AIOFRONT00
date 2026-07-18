import { useEffect, useState } from "react";

export function ResendCode({ onResend, seconds = 60 }) {
  const [remaining, setRemaining] = useState(seconds);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (remaining <= 0) return undefined;
    const timer = setTimeout(() => setRemaining((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining]);

  const handleClick = async () => {
    if (remaining > 0 || sending) return;
    setSending(true);
    try {
      await onResend();
      setRemaining(seconds);
    } finally {
      setSending(false);
    }
  };

  const minutes = Math.floor(remaining / 60);
  const secs = String(remaining % 60).padStart(2, "0");

  return (
    <button type="button" className="resend-code" onClick={handleClick} disabled={remaining > 0 || sending}>
      {remaining > 0
        ? `إعادة الإرسال خلال ${minutes}:${secs}`
        : sending ? "جاري الإرسال..." : "إعادة إرسال الرمز"}
    </button>
  );
}
