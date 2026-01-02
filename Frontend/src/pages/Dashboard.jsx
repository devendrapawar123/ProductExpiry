// src/pages/Dashboard.jsx
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getStatus } from "../utils/expiryUtils.js";
import ScanProductModal from "../components/ScanProductModal.jsx";
import { useToast } from "../components/ToastProvider.jsx"; // 👈 NEW

export default function Dashboard({ products, addProduct }) {
  const [scanOpen, setScanOpen] = useState(false);
  const toast = useToast(); // 👈 NEW

  const total = products.length;
  const expired = products.filter(
    (p) => getStatus(p.expDate).level === "expired"
  ).length;
  const near = products.filter(
    (p) => getStatus(p.expDate).level === "near"
  ).length;
  const safe = total - expired - near;

  const chartData = [
    { name: "Safe", value: safe },
    { name: "Near Expiry", value: near },
    { name: "Expired", value: expired },
  ];

  const COLORS = ["#22c55e", "#facc15", "#ef4444"];

  const handleOpenScan = () => setScanOpen(true);
  const handleCloseScan = () => setScanOpen(false);

  const handleAddFromScan = (newProduct) => {
    try {
      if (typeof addProduct === "function") {
        addProduct(newProduct);
        toast.success("Product added via scan.", {
          title: "Scan success",
        });
      } else {
        console.warn("addProduct prop missing on Dashboard");
        toast.error("Product could not be added, handler missing.", {
          title: "Scan error",
        });
      }
    } catch (e) {
      console.error("Scan add error:", e);
      toast.error("Failed to add scanned product.", {
        title: "Scan error",
      });
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-auto">
      {/* Top row: title + Scan button */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Dashboard Overview
          </h2>
          <p className="text-xs text-slate-500">
            Track product expiry, risk and quick scan entries.
          </p>
        </div>
        <button
          onClick={handleOpenScan}
          className="px-3 py-1.5 text-xs rounded-xl bg-blue-600 text-white hover:bg-blue-500"
        >
          📷 Scan Product
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-xs text-slate-500">Total Products</p>
          <h2 className="text-xl font-bold text-blue-700">{total}</h2>
        </div>
        <div className="bg-emerald-100 rounded-xl shadow p-4 text-center">
          <p className="text-xs text-slate-600">Safe</p>
          <h2 className="text-xl font-bold text-emerald-700">{safe}</h2>
        </div>
        <div className="bg-amber-100 rounded-xl shadow p-4 text-center">
          <p className="text-xs text-slate-600">Near Expiry</p>
          <h2 className="text-xl font-bold text-amber-700">{near}</h2>
        </div>
        <div className="bg-red-100 rounded-xl shadow p-4 text-center">
          <p className="text-xs text-slate-600">Expired</p>
          <h2 className="text-xl font-bold text-red-700">{expired}</h2>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">
            Product Status Overview
          </h3>
          <div className="w-full h-56">
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">
            Status Breakdown
          </h3>
          <div className="w-full h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  paddingAngle={4}
                >
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Scan modal */}
      <ScanProductModal
        open={scanOpen}
        onClose={handleCloseScan}
        onAdd={handleAddFromScan}
      />
    </div>
  );
}
