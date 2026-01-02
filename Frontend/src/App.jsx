// src/App.jsx
import { api } from "./api";
import React, { useState, useEffect } from "react";

import HomePage from "./pages/HomePage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProductList from "./pages/ProductList.jsx";
import Notifications from "./pages/Notification.jsx";
import Profile from "./pages/Profile.jsx";
import Settings from "./pages/Settings.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import { getStatus } from "./utils/expiryUtils.js";

import { useLanguage } from "./i18n/LanguageProvider.jsx";
import { scheduleExpiryNotifications } from "./utils/notify";
import { useToast } from "./components/ToastProvider.jsx";

export default function App() {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("expiryAuthUser") || "null")
  );

  // ✅ THEME STATE (FIX)
  const [theme, setTheme] = useState(
    () => localStorage.getItem("expiryTheme") || "light"
  );

  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);

  const toast = useToast();
  const { lang } = useLanguage();

  // ✅ APPLY THEME
  useEffect(() => {
    localStorage.setItem("expiryTheme", theme);

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  }, [theme]);

  // 🔥 USER-WISE PRODUCTS FETCH
  useEffect(() => {
    if (!user?.id) return;

    const fetchProducts = async () => {
      try {
        const res = await api.get(`/products/?user_id=${user.id}`);
        setProducts(res.data || []);

        const notifyDays =
          Number(localStorage.getItem("expiryNotifyDays")) || 7;

        scheduleExpiryNotifications(res.data || [], notifyDays, true);
      } catch (err) {
        console.error("API error:", err);
        toast.error("Failed to load products.", { title: "Error" });
      }
    };

    fetchProducts();
  }, [user?.id, toast]);

  const alertCount = products.filter((p) => {
    const s = getStatus(p.expDate);
    return s && s.level !== "safe";
  }).length;

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("expiryAuthUser", JSON.stringify(userData));
    setPage("dashboard");
    toast.success(`Welcome, ${userData.name}!`, {
      title: "Login successful",
    });
  };

  const handleLogout = () => {
    setUser(null);
    setPage("home");
    localStorage.removeItem("expiryAuthUser");
    toast.info("You have been logged out.", { title: "Logged out" });
  };

  if (!user) return <HomePage onLoginSubmit={handleLogin} />;

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-900">
      <Sidebar
        currentPage={page}
        alertCount={alertCount}
        onChangePage={(pg) => {
          setPage(pg);
          setSidebarOpen(false);
        }}
        className="hidden lg:flex"
      />

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex lg:hidden">
          <Sidebar
            currentPage={page}
            alertCount={alertCount}
            onChangePage={(pg) => {
              setPage(pg);
              setSidebarOpen(false);
            }}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <Topbar
          user={user}
          onLogout={handleLogout}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div className="flex-1 overflow-hidden">
          {page === "dashboard" && (
            <Dashboard products={products} language={lang} />
          )}

          {page === "products" && (
            <ProductList
              user={user}
              products={products}
              setProducts={setProducts}
              language={lang}
            />
          )}

          {page === "notifications" && (
            <Notifications
              products={products}
              onView={() => setPage("products")}
            />
          )}

          {page === "profile" && (
            <Profile user={user} setUser={setUser} />
          )}

          {page === "settings" && (
            <Settings
              theme={theme}
              setTheme={setTheme}
              user={user}
            />
          )}
        </div>
      </div>
    </div>
  );
}
