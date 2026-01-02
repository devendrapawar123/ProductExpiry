// src/pages/ProductList.jsx
import React, { useState, useMemo } from "react";
import { api } from "../api";
import AddProductModal from "../components/AddProductModal.jsx";
import ProductTable from "../components/ProductTable.jsx";
import { getStatus } from "../utils/expiryUtils.js";
import { useToast } from "../components/ToastProvider.jsx";

export default function ProductList({ user, products, setProducts }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const toast = useToast();

  // 💛 Form including image
  const [form, setForm] = useState({
    name: "",
    category: "",
    batch: "",
    barcode: "",
    mfgDate: "",
    expDate: "",
    quantity: "",
    image: null,
  });

  const reset = () =>
    setForm({
      name: "",
      category: "",
      batch: "",
      barcode: "",
      mfgDate: "",
      expDate: "",
      quantity: "",
      image: null,
    });

  // ⭐ Load product data into form (edit)
  const handleEdit = (p) => {
    setEditingId(p.id);

    setForm({
      name: p.name || "",
      category: p.category || "",
      batch: p.batch || "",
      barcode: p.barcode || "",
      mfgDate: p.mfgDate || "",
      expDate: p.expDate || "",
      quantity: String(p.quantity ?? ""),
      image: p.image || null, // Old image path
    });

    setModalOpen(true);
  };

  // ⭐⭐ Submit with FormData (image support)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.mfgDate || !form.expDate) {
      toast.warning("Please fill mandatory fields.", {
        title: "Missing fields",
      });
      return;
    }

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("category", form.category);
    fd.append("batch", form.batch);
    fd.append("barcode", form.barcode);
    fd.append("mfgDate", form.mfgDate);
    fd.append("expDate", form.expDate);
    fd.append("quantity", form.quantity);
    fd.append("user", user.id);

    // ⭐ New image only (if uploading file)
    if (form.image && typeof form.image === "object") {
      fd.append("image", form.image);
    }

    try {
      let res;

      if (editingId) {
        // UPDATE
        res = await api.put(`/products/${editingId}/`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setProducts((prev) =>
          prev.map((p) => (p.id === editingId ? res.data : p))
        );

        toast.success("Product updated successfully.", {
          title: "Updated",
        });
      } else {
        // CREATE
        res = await api.post("/products/", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setProducts((prev) => [res.data, ...prev]);

        toast.success("Product added successfully.", {
          title: "Added",
        });
      }

      reset();
      setEditingId(null);
      setModalOpen(false);
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Save failed. Check console.", { title: "Error" });
    }
  };

  // 🔎 Search + Filter
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    let data = [...products];
    const q = search.toLowerCase();

    if (q) {
      data = data.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.batch?.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== "all") {
      data = data.filter((p) => p.category === categoryFilter);
    }

    return data;
  }, [products, search, categoryFilter]);

  const getRowClass = (expDate) => {
    const { level } = getStatus(expDate);
    if (level === "expired") return "bg-red-50";
    if (level === "near") return "bg-amber-50";
    return "";
  };

  // 🗑 DELETE PRODUCT
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/products/${id}/`);
      setProducts((prev) => prev.filter((p) => p.id !== id));

      toast.success("Product deleted.", { title: "Deleted" });
    } catch (err) {
      toast.error("Delete failed.", { title: "Error" });
    }
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 pt-3 pb-1 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Product List</h2>
          <p className="text-xs text-slate-500">Manage all products</p>
        </div>

        <button
          onClick={() => {
            reset();
            setEditingId(null);
            setModalOpen(true);
          }}
          className="px-3 py-1.5 text-xs rounded-xl bg-blue-600 text-white hover:bg-blue-500"
        >
          + Add Product
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 max-w-6xl mx-auto px-4 pb-4 min-h-0">
        <ProductTable
          products={filteredProducts}
          search={search}
          setSearch={setSearch}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          onEdit={handleEdit}
          onDelete={handleDelete}
          getRowClass={getRowClass}
        />
      </div>

      {/* Modal */}
      <AddProductModal
        open={modalOpen}
        editingId={editingId}
        form={form}
        onChange={(e) => {
          const { name, value, files } = e.target;
          setForm((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
          }));
        }}
        onSubmit={handleSubmit}
        onClose={() => {
          reset();
          setEditingId(null);
          setModalOpen(false);
        }}
      />
    </div>
  );
}
