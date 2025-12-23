// src/components/NotificationStatus.jsx
import React, { useEffect, useState } from "react";
import { requestNotificationPermission } from "../utils/notify";

/*
  Small component that shows current Notification.permission,
  gives a button to request permission (if not granted),
  and a button to open browser site-permission/settings instructions.
*/

export default function NotificationStatus({ className = "" }) {
  const [perm, setPerm] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "unsupported"
  );

  useEffect(() => {
    const onFocus = () => {
      setPerm(typeof Notification !== "undefined" ? Notification.permission : "unsupported");
    };
    window.addEventListener("focus", onFocus);
    // also track permission changes every few seconds as fallback
    const interval = setInterval(onFocus, 1500);
    return () => {
      window.removeEventListener("focus", onFocus);
      clearInterval(interval);
    };
  }, []);

  const askPermission = async () => {
    const res = await requestNotificationPermission();
    setPerm(res);
  };

  const openSiteSettings = () => {
    // Try to open the browser's settings page for notifications.
    // Works for Chromium-based browsers:
    try {
      // for Edge/Chrome local dev pages, open the content settings URL
      window.open("edge://settings/content/notifications", "_blank");
    } catch (e) {
      // fallback - tell user to open manually
      alert(
        "Open your browser settings -> Site permissions -> Notifications and allow notifications for this site."
      );
    }
  };

  const badge =
    perm === "granted"
      ? "bg-green-100 text-green-800"
      : perm === "denied"
      ? "bg-red-100 text-red-800"
      : "bg-yellow-100 text-yellow-800";

  return (
    <div className={`p-3 rounded border ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${badge}`}>
            {perm}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-300 mt-1">
            Browser notification permission
          </div>
        </div>

        <div className="flex items-center gap-2">
          {perm !== "granted" && (
            <button
              onClick={askPermission}
              className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
            >
              Request
            </button>
          )}

          {perm === "denied" && (
            <button
              onClick={openSiteSettings}
              className="px-3 py-1 rounded border text-sm"
              title="Open browser notification settings"
            >
              Open site settings
            </button>
          )}
        </div>
      </div>

      {perm === "denied" && (
        <p className="mt-2 text-[12px] text-red-600">
          Notifications are blocked for this site. Click <b>Open site settings</b> and set to
          “Allow”, then reload the page.
        </p>
      )}

      {perm === "granted" && (
        <p className="mt-2 text-[12px] text-slate-500 dark:text-slate-300">
          Notifications enabled — you'll receive expiry alerts in this browser.
        </p>
      )}
    </div>
  );
}
