// src/components/AddProductModal.jsx
import React, { useState } from "react";
import BarcodeScanner from "./BarcodeScanner.jsx";
import { useToast } from "./ToastProvider.jsx";

export default function AddProductModal({
  open,
  form,
  onChange,
  onSubmit,
  onClose,
  editingId,
}) {
  const [scannerOpen, setScannerOpen] = useState(false);
  const toast = useToast();

  if (!open) return null;

  const handleScan = (code) => {
    onChange({ target: { name: "batch", value: code.slice(0, 10) } });
    onChange({ target: { name: "name", value: `Product ${code.slice(-4)}` } });
    setScannerOpen(false);
    toast.success("Barcode scanned!", { title: "Scan success" });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    onChange({ target: { name: "image", value: file } });
  };

  // Detect image preview source
  const getPreviewImage = () => {
    if (!form.image) return null;

    // NEW FILE selected
    if (typeof form.image === "object") {
      return URL.createObjectURL(form.image);
    }

    // OLD IMAGE coming from backend
    return `http://127.0.0.1:8000${form.image}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-5 z-50">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-xl shadow-2xl p-5">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            {editingId ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            className="text-slate-500 text-lg hover:text-red-600"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="grid gap-3 text-sm">

          {/* IMAGE UPLOAD */}
          <div>
            <label className="text-xs text-slate-600 dark:text-slate-300">
              Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border rounded-lg px-3 py-2 mt-1 dark:bg-slate-700 dark:border-slate-600"
            />
          </div>

          {/* IMAGE PREVIEW (new or old) */}
          {form.image && (
            <img
              src={getPreviewImage()}
              className="w-24 h-24 rounded-lg object-cover border mx-auto"
            />
          )}

          {/* NAME */}
          <div>
            <label className="text-xs text-slate-600 dark:text-slate-300">
              Product Name *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              required
              className="w-full border rounded-lg px-3 py-2 mt-1 dark:bg-slate-700 dark:border-slate-600"
              placeholder="Enter product name"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="text-xs text-slate-600 dark:text-slate-300">
              Category
            </label>
            <input
              name="category"
              value={form.category}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2 mt-1 dark:bg-slate-700 dark:border-slate-600"
              placeholder="Medicine / Food / Other"
            />
          </div>

          {/* BATCH */}
          <div>
            <label className="text-xs text-slate-600 dark:text-slate-300">
              Batch No
            </label>
            <input
              name="batch"
              value={form.batch}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2 mt-1 dark:bg-slate-700 dark:border-slate-600"
              placeholder="Scan to auto-fill"
            />
          </div>

          {/* SCAN BUTTON */}
          <button
            type="button"
            className="w-full py-2 bg-yellow-500 hover:bg-yellow-400 rounded-lg text-white font-medium"
            onClick={() => setScannerOpen(true)}
          >
            📷 Scan Barcode
          </button>

          {/* MFG */}
          <div>
            <label className="text-xs text-slate-600 dark:text-slate-300">
              Manufacturing Date *
            </label>
            <input
              type="date"
              name="mfgDate"
              value={form.mfgDate}
              onChange={onChange}
              required
              className="w-full border rounded-lg px-3 py-2 mt-1 dark:bg-slate-700 dark:border-slate-600"
            />
          </div>

          {/* EXPIRY */}
          <div>
            <label className="text-xs text-slate-600 dark:text-slate-300">
              Expiry Date *
            </label>
            <input
              type="date"
              name="expDate"
              value={form.expDate}
              onChange={onChange}
              required
              className="w-full border rounded-lg px-3 py-2 mt-1 dark:bg-slate-700 dark:border-slate-600"
            />
          </div>

          {/* QUANTITY */}
          <div>
            <label className="text-xs text-slate-600 dark:text-slate-300">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              min="1"
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2 mt-1 dark:bg-slate-700 dark:border-slate-600"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full py-2 mt-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500"
          >
            {editingId ? "Update Product" : "Add Product"}
          </button>
        </form>

        {/* BARCODE SCANNER MODAL */}
        {scannerOpen && (
          <BarcodeScanner
            onDetected={handleScan}
            onClose={() => setScannerOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
