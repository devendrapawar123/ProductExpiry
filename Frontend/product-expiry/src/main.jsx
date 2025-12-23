// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { LanguageProvider } from "./i18n/LanguageProvider.jsx";
import { ToastProvider } from "./components/ToastProvider.jsx";

// Load theme before render
try {
  const savedTheme = localStorage.getItem("expiryTheme") || "light";
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  }
} catch (e) {
  console.warn("Could not load initial theme:", e);
}

const savedLang = localStorage.getItem("expiryLanguage") || "en";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LanguageProvider initialLang={savedLang}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </LanguageProvider>
  </React.StrictMode>
);

// register service worker for notifications (optional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then((reg) => {
      console.log("ServiceWorker registered:", reg);
    }).catch((err) => {
      console.warn("ServiceWorker registration failed:", err);
    });
  });
}

