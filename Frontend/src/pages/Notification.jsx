// src/pages/Notification.jsx
import React, { useMemo } from "react";
import { getStatus } from "../utils/expiryUtils.js";

export default function Notifications({ products, onView }) {
  const alerts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    return products
      .map((p) => ({ ...p, ...getStatus(p.expDate) }))
      .filter((p) => p.level === "expired" || p.level === "near")
      .sort((a, b) => {
        if (a.level === b.level) return a.expiryDays - b.expiryDays;
        return a.level === "expired" ? -1 : 1;
      });
  }, [products]);

  return (
    <div className="flex-1 p-6 overflow-auto space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Notifications
          </h2>
          <p className="text-xs text-slate-500">
            Expiring products alerts and safety warnings
          </p>
        </div>

        {alerts.length > 0 && (
          <span className="text-[11px] px-2 py-1 rounded-lg bg-red-600 text-white">
            {alerts.length} alerts
          </span>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="bg-emerald-50 text-emerald-700 text-sm p-3 rounded-xl shadow-sm">
          🎉 No expiry risk — All products are safe!
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl shadow-md flex justify-between items-center border-l-4 ${
                alert.level === "expired"
                  ? "bg-red-50 border-red-600"
                  : "bg-amber-50 border-amber-500"
              }`}
            >
              <div>
                <p className="font-semibold text-slate-900 text-sm">
                  {alert.name} ({alert.batch})
                </p>
                <p
                  className={`text-xs ${
                    alert.level === "expired"
                      ? "text-red-700"
                      : "text-amber-700"
                  }`}
                >
                  {alert.text}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  EXP Date: {alert.expDate}
                </p>
              </div>

              {onView && (
                <button
                  onClick={() => onView(alert.id)}
                  className="text-xs text-blue-700 hover:underline"
                >
                  View →
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
