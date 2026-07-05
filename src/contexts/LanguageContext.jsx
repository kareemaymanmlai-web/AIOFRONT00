import { createContext, useContext, useEffect, useMemo, useState } from "react";

const copy = {
  ar: {
    ready: "جاهز للربط مع الباك اند",
    search: "بحث...",
    all: "الكل",
    loading: "جاري تحميل البيانات...",
    noData: "لا توجد بيانات",
    theme: "الوضع",
    language: "English",
    markRead: "تحديد الكل كمقروء",
    loginSuccess: "تم تسجيل الدخول بنجاح",
    loginError: "فشل تسجيل الدخول",
    emailError: "اكتب بريد إلكتروني صحيح",
    passwordError: "كلمة المرور لا تقل عن 6 أحرف"
  },
  en: {
    ready: "Ready for backend integration",
    search: "Search...",
    all: "All",
    loading: "Loading data...",
    noData: "No data available",
    theme: "Theme",
    language: "عربي",
    markRead: "Mark all as read",
    loginSuccess: "Signed in successfully",
    loginError: "Sign in failed",
    emailError: "Enter a valid email address",
    passwordError: "Password must be at least 6 characters"
  }
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem("ain-language") || "ar");

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    localStorage.setItem("ain-language", language);
  }, [language]);

  const value = useMemo(() => ({
    language,
    t: copy[language],
    toggleLanguage() {
      setLanguage((current) => current === "ar" ? "en" : "ar");
    }
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used inside LanguageProvider");
  return value;
}
