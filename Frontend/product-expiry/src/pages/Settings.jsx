// src/pages/Settings.jsx
import React, { useEffect, useState } from "react";
import { api } from "../api";
import { useLanguage } from "../i18n/LanguageProvider.jsx";

export default function Settings({ theme, setTheme, user }) {
  const [notifyDays, setNotifyDays] = useState(7);
  const [systemNotifications, setSystemNotifications] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const { lang, setLanguage: setLangFromProvider, t } = useLanguage();

  // helper for system notif flag
  const loadSystemFlag = () => {
    if (typeof window === "undefined") return true;
    try {
      const raw = localStorage.getItem("expirySystemNotifications");
      return raw !== "off"; // default ON
    } catch {
      return true;
    }
  };

  const saveSystemFlag = (on) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("expirySystemNotifications", on ? "on" : "off");
    } catch (e) {
      console.warn("Could not persist system notif flag", e);
    }
  };

  // Load settings from backend when component mounts / user changes
  useEffect(() => {
    const fetchSettings = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await api.get(`/settings/${user.id}/`);
        console.log("Settings from backend:", res.status, res.data);

        const serverTheme = res.data?.theme ?? "light";
        const serverLang = res.data?.language ?? "en";
        const serverNotify = res.data?.notify_days_before ?? 7;

        setTheme(serverTheme);
        setLangFromProvider(serverLang);
        setNotifyDays(serverNotify);

        // notify days -> localStorage
        try {
          localStorage.setItem("expiryNotifyDays", Number(serverNotify));
        } catch (e) {
          console.warn("Could not persist notifyDays", e);
        }

        // system notif -> purely local
        setSystemNotifications(loadSystemFlag());

        // Trigger scheduling from here if global function present
        try {
          const products = JSON.parse(localStorage.getItem("expiryProducts") || "[]");
          if (window.scheduleExpiryNotifications) {
            window.scheduleExpiryNotifications(products, Number(serverNotify));
          }
        } catch (e) {
          console.warn("Could not schedule notifications after load", e);
        }
      } catch (err) {
        console.error("Settings load error:", err);
        setError(
          t ? t("loading_settings") ?? "Failed to load settings." : "Failed to load settings."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, setTheme]);

  // theme change → immediate (optimistic)
  const handleThemeChange = (value) => {
    try {
      setTheme(value);
      localStorage.setItem("expiryTheme", value);

      if (value === "dark") {
        document.documentElement.classList.add("dark");
        document.body.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
        document.body.classList.remove("dark");
      }

      void document.body.offsetHeight;
    } catch (e) {
      console.warn("Could not apply theme optimistically", e);
    }
  };

  const handleSystemToggle = (on) => {
    setSystemNotifications(on);
    saveSystemFlag(on);
  };

  // Save settings to backend (theme + language + notifyDays)
  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    if (!user?.id) {
      setError("No user found");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        theme,
        language: lang,
        notify_days_before: Number(notifyDays) || 7,
      };

      console.log("Saving settings payload:", payload);

      const putRes = await api.put(`/settings/${user.id}/`, payload);
      console.log("PUT response:", putRes.status, putRes.data);

      let serverSettings =
        putRes.data && Object.keys(putRes.data).length ? putRes.data : null;

      if (!serverSettings) {
        try {
          const getRes = await api.get(`/settings/${user.id}/`);
          console.log("GET after PUT response:", getRes.status, getRes.data);
          serverSettings = getRes.data;
        } catch (getErr) {
          console.error("Failed to GET settings after PUT:", getErr);
        }
      }

      const finalTheme = serverSettings?.theme ?? theme;
      const finalLang = serverSettings?.language ?? lang;
      const finalNotify =
        serverSettings?.notify_days_before ?? Number(notifyDays) ?? 7;

      // persist locally
      try {
        localStorage.setItem("expiryTheme", finalTheme);
        localStorage.setItem("expiryLanguage", finalLang);
        localStorage.setItem("expiryNotifyDays", Number(finalNotify));

        // ⚠️ system notif is purely frontend setting
        saveSystemFlag(systemNotifications);
      } catch (e) {
        console.warn("Could not write to localStorage", e);
      }

      // apply theme classes
      if (finalTheme === "dark") {
        document.documentElement.classList.add("dark");
        document.body.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
        document.body.classList.remove("dark");
      }
      void document.body.offsetHeight;

      // language provider
      setLangFromProvider(finalLang);

      // re-schedule notifications with possibly new notifyDays
      try {
        const products = JSON.parse(localStorage.getItem("expiryProducts") || "[]");
        if (window.scheduleExpiryNotifications) {
          window.scheduleExpiryNotifications(products, Number(finalNotify));
        }
      } catch (e) {
        console.warn("Could not schedule notifications after save", e);
      }

      console.log("Final applied settings:", {
        finalTheme,
        finalLang,
        finalNotify,
        systemNotifications,
      });

      alert(
        t ? t("settings_updated") ?? "Settings updated!" : "Settings updated!"
      );
    } catch (err) {
      console.error("Settings save error:", err);
      setError(
        t ? t("save_error") ?? "Failed to save settings." : "Failed to save settings."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-sm text-slate-600">
        {t ? t("loading_settings") : "Loading settings..."}
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-900 flex justify-center px-4 py-6 overflow-auto">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
          {t ? t("settings") : "Settings"}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-300 mb-4">
          {t
            ? t("settings_description") ??
              "Customize theme, language, notifications and expiry alerts."
            : "Customize theme, language, notifications and expiry alerts."}
        </p>

        <form onSubmit={handleSave} className="space-y-4 text-sm">
          {/* Theme */}
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-1">
              {t ? t("theme_label") ?? "Theme" : "Theme"}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleThemeChange("light")}
                className={`flex-1 py-2 rounded-xl border text-xs ${
                  theme === "light"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-200"
                }`}
              >
                {t ? t("light") ?? "Light" : "Light"}
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange("dark")}
                className={`flex-1 py-2 rounded-xl border text-xs ${
                  theme === "dark"
                    ? "bg-slate-900 text-white border-slate-900"
                    : "border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-200"
                }`}
              >
                {t ? t("dark") ?? "Dark" : "Dark"}
              </button>
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="text-xs text-slate-600 dark:text-slate-300 mb-1 block">
              {t ? t("language_label") ?? "Language" : "Language"}
            </label>
            <select
              value={lang}
              onChange={(e) => setLangFromProvider(e.target.value)}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/40 bg-white dark:bg-slate-700 dark:text-slate-100"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
          </div>

          {/* System Notifications ON/OFF */}
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-1">
              System Notifications (OS / Browser popups)
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleSystemToggle(true)}
                className={`flex-1 py-2 rounded-xl border text-xs ${
                  systemNotifications
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-200"
                }`}
              >
                ON
              </button>
              <button
                type="button"
                onClick={() => handleSystemToggle(false)}
                className={`flex-1 py-2 rounded-xl border text-xs ${
                  !systemNotifications
                    ? "bg-slate-900 text-white border-slate-900"
                    : "border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-200"
                }`}
              >
                OFF
              </button>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-1">
              Ye setting sirf system/browser notifications ko control karti hai.
              Top-right wale in-app toast normal chalenge.
            </p>
          </div>

          {/* Notify days before expiry */}
          <div>
            <label className="text-xs text-slate-600 dark:text-slate-300 mb-1 block">
              {t
                ? t("notify_label") ?? "Alert me before expiry (days)"
                : "Alert me before expiry (days)"}
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={notifyDays}
              onChange={(e) => setNotifyDays(e.target.value)}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/40 dark:bg-slate-700 dark:text-slate-100"
              placeholder="7"
            />
            <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-1">
              {t
                ? t("notify_example") ??
                  "Example: 7 ka matlab product expire hone se 7 din pehle alert."
                : "Example: 7 ka matlab product expire hone se 7 din pehle alert."}
            </p>
          </div>

          {error && (
            <p className="text-[11px] text-red-600 bg-red-100 border border-red-200 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full mt-2 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 disabled:opacity-60"
          >
            {saving
              ? t
                ? t("saving") ?? "Saving..."
                : "Saving..."
              : t
              ? t("save_button") ?? "Save Settings"
              : "Save Settings"}
          </button>
        </form>
      </div>
    </div>
  );
}
