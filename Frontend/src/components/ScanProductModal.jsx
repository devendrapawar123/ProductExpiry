import React, { useState } from "react";

export default function ScanProductModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    batch: "",
    mfgDate: "",
    expDate: "",
    quantity: "",
  });

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSimulateScan = () => {
    // Demo data – real app me yahan barcode/QR se data aayega
    setForm({
      name: "Scanned Milk 500ml",
      category: "Dairy",
      batch: "SCN-001",
      mfgDate: "2025-11-20",
      expDate: "2025-12-05",
      quantity: "12",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.mfgDate || !form.expDate) {
      alert("Please fill Name, MFG and EXP date.");
      return;
    }
    onAdd({
      name: form.name,
      category: form.category,
      batch: form.batch,
      mfgDate: form.mfgDate,
      expDate: form.expDate,
      quantity: Number(form.quantity || 0),
    });
    onClose();
    setForm({
      name: "",
      category: "",
      batch: "",
      mfgDate: "",
      expDate: "",
      quantity: "",
    });
  };

  const handleClear = () => {
    setForm({
      name: "",
      category: "",
      batch: "",
      mfgDate: "",
      expDate: "",
      quantity: "",
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-7">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Scan Product (Demo)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              In real app, camera / barcode scanner se details auto-fill hongi.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50"
          >
            ✕
          </button>
        </div>

        <div className="mb-3 flex flex-col gap-2 text-xs bg-slate-50 border border-slate-200 rounded-2xl p-3">
          <p className="font-semibold text-slate-700">
            Simulate Scan (Barcode / QR)
          </p>
          <p className="text-slate-500">
            Abhi yeh demo hai. “Simulate Scan” par click karoge to sample
            product details auto-fill ho jayengi.
          </p>
          <button
            type="button"
            onClick={handleSimulateScan}
            className="self-start mt-1 px-3 py-1.5 rounded-xl text-xs bg-blue-600 text-white hover:bg-blue-500"
          >
            🔍 Simulate Scan
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2 text-sm">
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              Product Name *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Scanned product name"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              Category
            </label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Dairy / Grocery / etc."
              className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              Batch No.
            </label>
            <input
              name="batch"
              value={form.batch}
              onChange={handleChange}
              placeholder="SCN-001"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              MFG Date *
            </label>
            <input
              type="date"
              name="mfgDate"
              value={form.mfgDate}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              EXP Date *
            </label>
            <input
              type="date"
              name="expDate"
              value={form.expDate}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              min="0"
              value={form.quantity}
              onChange={handleChange}
              placeholder="12"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>

          <div className="sm:col-span-2 flex justify-between gap-2 pt-2">
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              Clear
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500"
              >
                Add to Products
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
