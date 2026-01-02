/*import React from "react";

export default function Sidebar({ currentPage, onChangePage }) {
  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: "📊" },
    { key: "products", label: "Product List", icon: "📦" },
    { key: "notifications", label: "Notifications", icon: "🔔" },
    { key: "profile", label: "User Profile", icon: "👤" },
    { key: "settings", label: "Settings", icon: "⚙" },
  ];

  const base =
    "w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all";

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-gradient-to-b from-blue-600 via-blue-700 to-blue-900 text-white min-h-screen shadow-2xl">
      {/* Logo / Title *///}
      /*<div className="px-6 pt-6 pb-4 flex items-center gap-3 border-b border-white/10">
        <div className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center text-xl">
          🧾
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight">
            Expiry<span className="text-cyan-200">Guard</span>
          </p>
          <p className="text-[11px] text-blue-100/80">
            Product Expiry Dashboard
          </p>
        </div>
      </div>

      {/* Navigation Buttons *///}
     /* <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
        {navItems.map((item) => {
          const active = currentPage === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onChangePage(item.key)}
              className={
                base +
                " " +
                (active
                  ? "bg-white text-blue-700 shadow-md"
                  : "text-blue-100/80 hover:bg-white/10")
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer *////}
     /* <div className="px-5 py-4 border-t border-white/10 text-[11px] text-blue-100/70">
        <p>Expiry tracking • Alerts • Reports</p>
      </div>
    </aside>
  );
}*/

import React from "react";

const items = [
  { key: "dashboard", label: "Dashboard", icon: "📊" },
  { key: "products", label: "Products", icon: "📦" },
  { key: "notifications", label: "Notifications", icon: "🔔" },
  { key: "profile", label: "Profile", icon: "👤" },
  { key: "settings", label: "Settings", icon: "⚙️" },
];

export default function Sidebar({ currentPage, onChangePage, alertCount, className }) {
  return (
    <aside className={`${className} flex flex-col w-64 bg-gradient-to-b from-blue-600 to-blue-900 text-white shadow-xl`}>
      <div className="px-6 py-5 border-b border-white/20 text-lg font-bold">
        🧾 Expiry<span className="text-cyan-200">Guard</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-2">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => onChangePage(item.key)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition ${
              currentPage === item.key
                ? "bg-white text-blue-700 shadow-md"
                : "hover:bg-white/10 text-blue-100"
            }`}
          >
            <span className="flex items-center gap-3">
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </span>

            {item.key === "notifications" && alertCount > 0 && (
              <span className="bg-red-500 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                {alertCount}
              </span>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
}

