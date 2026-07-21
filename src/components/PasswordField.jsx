import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function PasswordField({ value, onChange, onBlur, minLength = 6, placeholder, autoComplete = "current-password", required = true }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="stitch-input">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        minLength={minLength}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
      />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
        tabIndex={-1}
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
