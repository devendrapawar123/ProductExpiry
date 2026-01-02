// src/pages/HomePage.jsx
import React, { useState } from "react";
import AuthModal from "../pages/AuthModal.jsx";

export default function HomePage({ onLoginSubmit }) {
  const [showAuth, setShowAuth] = useState(false);
  const [mode, setMode] = useState("login"); // "login" | "register"

  const openAuth = (m) => {
    setMode(m);
    setShowAuth(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <header className="w-full bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-lg">
              🧾
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Expiry<span className="text-blue-600">Guard</span>
              </p>
              <p className="text-[11px] text-slate-500">
                Product Expiry Management
              </p>
            </div>
          </div>

          <div className="flex gap-2 text-sm">
            <button
              onClick={() => openAuth("login")}
              className="px-4 py-1.5 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Login
            </button>
            <button
              onClick={() => openAuth("register")}
              className="px-4 py-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-500"
            >
              Create Account
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
     <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight max-w-2xl">
          Track product expiry &amp; reduce{" "}
          <span className="text-blue-600">loss and risk</span>.
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl">
          ExpiryGuard aapko batata hai kaunse products safe hain, kaunse
          near-expiry aur kaunse expire ho chuke hain – simple dashboard se.
        </p>

        <div className="mt-6 flex gap-3 flex-wrap justify-center">
          <button
            onClick={() => openAuth("login")}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500"
          >
            Get Started (Login)
          </button>
          <button
            onClick={() => openAuth("register")}
            className="px-6 py-2.5 rounded-xl border border-blue-600 text-blue-700 text-sm font-semibold hover:bg-blue-50"
          >
            Create free account
          </button>
        </div>

        {/* Small feature bullets */}
        <div className="mt-8 grid gap-3 sm:grid-cols-3 max-w-3xl text-left text-xs sm:text-sm">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3">
            <p className="font-semibold text-slate-800">Expiry Alerts</p>
            <p className="mt-1 text-slate-500">
              Safe, Near Expiry aur Expired status color-coded badges ke saath.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3">
            <p className="font-semibold text-slate-800">Smart Dashboard</p>
            <p className="mt-1 text-slate-500">
              Charts, cards &amp; tables se ek glance me risk samajh lo.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3">
            <p className="font-semibold text-slate-800">
              Manual + Scan (future)
            </p>
            <p className="mt-1 text-slate-500">
              Abhi products manually add hote hain. Future scope: barcode/QR
              scan se auto entry.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white text-[11px] py-3 text-center">
        © {new Date().getFullYear()} ExpiryGuard • Smart Expiry Tracking System
      </footer>

      {/* Auth Modal */}
      {showAuth && (
        <AuthModal
          mode={mode}
          onClose={() => setShowAuth(false)}
          onLoginSubmit={onLoginSubmit}
        />
      )}
    </div>
  );
}
