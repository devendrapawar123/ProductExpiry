// src/components/Topbar.jsx
import React from "react";
import { useLanguage } from "../i18n/LanguageProvider";

export default function Topbar({ user, onLogout, onMenuClick }) {
  const { t } = useLanguage();

  const initials = user?.name?.slice(0, 2)?.toUpperCase() || "U";

  return (
    <div className="h-14 bg-white dark:bg-slate-800 shadow flex items-center justify-between px-5">
      
      <button onClick={onMenuClick} className="lg:hidden text-2xl text-blue-700">
        ☰
      </button>

      <h3 className="text-sm font-semibold text-slate-700 dark:text-white">
        {t("welcome")}, {user?.name?.split(" ")[0]} 👋
      </h3>

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-700 text-white rounded-full flex items-center justify-center">
          {initials}
        </div>

        <button
          onClick={onLogout}
          className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg"
        >
          {t("logout")}
        </button>
      </div>
    </div>
  );
}
