import React, { useMemo } from "react";
import { getStatus } from "../utils/expiryUtils.js";

export default function StatCards({ products }) {
  const stats = useMemo(() => {
    let total = products.length;
    let safe = 0;
    let near = 0;
    let expired = 0;

    products.forEach((p) => {
      const { level } = getStatus(p.expDate);
      if (level === "safe") safe++;
      else if (level === "near") near++;
      else if (level === "expired") expired++;
    });

    return { total, safe, near, expired };
  }, [products]);

  const card =
    "bg-white rounded-2xl shadow-sm border border-slate-100 px-4 py-3 flex flex-col justify-between";

  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className={card}>
        <p className="text-[11px] text-slate-500 uppercase font-semibold">
          Total Products
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900">
          {stats.total}
        </p>
        <p className="text-[11px] text-slate-400 mt-1">Tracked items</p>
      </div>

      <div className={card}>
        <p className="text-[11px] text-slate-500 uppercase font-semibold">
          Safe
        </p>
        <p className="mt-1 text-2xl font-bold text-emerald-600">
          {stats.safe}
        </p>
        <p className="text-[11px] text-slate-400 mt-1">
          Not expiring in 7 days
        </p>
      </div>

      <div className={card}>
        <p className="text-[11px] text-slate-500 uppercase font-semibold">
          Near Expiry
        </p>
        <p className="mt-1 text-2xl font-bold text-amber-500">
          {stats.near}
        </p>
        <p className="text-[11px] text-slate-400 mt-1">
          Expiring within 7 days
        </p>
      </div>

      <div className={card}>
        <p className="text-[11px] text-slate-500 uppercase font-semibold">
          Expired
        </p>
        <p className="mt-1 text-2xl font-bold text-red-500">
          {stats.expired}
        </p>
        <p className="text-[11px] text-slate-400 mt-1">
          Remove from shelf
        </p>
      </div>
    </section>
  );
}
