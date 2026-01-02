import React from "react";
import { getStatus } from "../utils/expiryUtils.js";

export default function StatusBadge({ expDate }) {
  const { label, level } = getStatus(expDate);

  const base =
    "inline-flex items-center px-2 py-1 rounded-full text-[11px] font-semibold";
  const styles =
    level === "expired"
      ? "bg-red-100 text-red-700"
      : level === "near"
      ? "bg-yellow-100 text-yellow-700"
      : level === "safe"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-slate-100 text-slate-600";

  return <span className={`${base} ${styles}`}>{label}</span>;
}
