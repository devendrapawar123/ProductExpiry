// src/components/NotificationPrompt.jsx
import React, { useState, useEffect } from "react";
import { requestNotificationPermission } from "../utils/notify";
import { useToast } from "./ToastProvider";

export default function NotificationPrompt() {
  const [perm, setPerm] = useState(() =>
    typeof Notification !== "undefined"
      ? Notification.permission
      : "unsupported"
  );

  const toast = useToast();

  useEffect(() => {
    const onFocus = () =>
      setPerm(
        typeof Notification !== "undefined"
          ? Notification.permission
          : "unsupported"
      );

    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const ask = async () => {
    const r = await requestNotificationPermission();
    setPerm(r);

    if (r === "granted") {
      toast.success("Browser notifications enabled.", {
        title: "Notifications",
      });
    } else if (r === "denied") {
      toast.error("You blocked notifications for this site.", {
        title: "Notifications",
      });
    } else {
      toast.info(`Notification permission: ${r}`, {
        title: "Notifications",
      });
    }
  };

  if (perm === "granted") {
    // Agar already granted hai to UI optional hai, par chhota info dikha sakte ho
    return null;
  }

  return (
    <div className="p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 mb-4 text-xs border border-yellow-200 dark:border-yellow-700/60">
      <div className="mb-2 font-medium text-yellow-900 dark:text-yellow-100">
        Enable browser notifications to receive expiry alerts.
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={ask}
          className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500"
        >
          {perm === "default" || perm === "prompt"
            ? "Enable Notifications"
            : "Retry Permission"}
        </button>
        <div className="text-[11px] text-slate-600 dark:text-slate-300">
          Current: <span className="font-mono">{perm}</span>
        </div>
      </div>
    </div>
  );
}
