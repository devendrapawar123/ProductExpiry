/*import React from "react";
import StatusBadge from "./StatusBadge.jsx";

export default function ProductTable({
  products,
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  onEdit,
  onDelete,
  getRowClass,
}) {
  return (
    <div className="bg-white shadow rounded-xl h-full flex flex-col">
      
      {/* Search + Filter *///}
     /* <div className="p-3 flex gap-3 text-xs">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="flex-1 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/40"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-slate-200 rounded-xl px-2 py-2 outline-none focus:ring-2 focus:ring-blue-500/40"
        >
          <option value="all">All Categories</option>
          <option value="Dairy">Dairy</option>
          <option value="Grocery">Grocery</option>
          <option value="Medicine">Medicine</option>
        </select>
      </div>

      {/* Table *///}
      /*<div className="overflow-auto">
        <table className="w-full text-xs">
          <thead className="bg-slate-100 text-slate-600 font-medium">
            <tr>
              <th className="py-2 px-2">Name</th>
              <th className="py-2 px-2">Category</th>
              <th className="py-2 px-2">Batch</th>
              <th className="py-2 px-2">MFG</th>
              <th className="py-2 px-2">EXP</th>
              <th className="py-2 px-2">Qty</th>
              <th className="py-2 px-2 text-center">Status</th>
              <th className="py-2 px-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-slate-400">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr
                  key={p.id}
                  id={`product-${p.id}`}
                  className={`${getRowClass(p.expDate)} hover:bg-blue-50 transition`}
                >
                  <td className="py-2 px-2">{p.name}</td>
                  <td className="py-2 px-2">{p.category}</td>
                  <td className="py-2 px-2">{p.batch}</td>
                  <td className="py-2 px-2">{p.mfgDate}</td>
                  <td className="py-2 px-2">{p.expDate}</td>
                  <td className="py-2 px-2">{p.quantity}</td>
                  <td className="py-2 px-2 text-center">
                    <StatusBadge expDate={p.expDate} />
                  </td>
                  <td className="py-2 px-2 text-right">
                    <button
                      className="text-blue-600 hover:underline mr-3"
                      onClick={() => onEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => onDelete(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}*/

import React from "react";
import StatusBadge from "./StatusBadge.jsx";

export default function ProductTable({
  products,
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  onEdit,
  onDelete,
  getRowClass,
}) {
  // Base backend URL
  const BASE_URL = "http://127.0.0.1:8000";

  const getImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith("http")) return img; // already full
    return BASE_URL + img; // convert /media/... → full URL
  };

  return (
    <div className="bg-white shadow rounded-xl h-full flex flex-col">
      
      {/* Search + Filter */}
      <div className="p-3 flex gap-3 text-xs">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="flex-1 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/40"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-slate-200 rounded-xl px-2 py-2 outline-none focus:ring-2 focus:ring-blue-500/40"
        >
          <option value="all">All Categories</option>
          <option value="Dairy">Dairy</option>
          <option value="Grocery">Grocery</option>
          <option value="Medicine">Medicine</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="w-full text-xs">
          <thead className="bg-slate-100 text-slate-600 font-medium">
            <tr>
              <th className="py-2 px-2">Image</th>
              <th className="py-2 px-2">Name</th>
              <th className="py-2 px-2">Category</th>
              <th className="py-2 px-2">Batch</th>
              <th className="py-2 px-2">MFG</th>
              <th className="py-2 px-2">EXP</th>
              <th className="py-2 px-2">Qty</th>
              <th className="py-2 px-2 text-center">Status</th>
              <th className="py-2 px-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-4 text-slate-400">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr
                  key={p.id}
                  className={`${getRowClass(p.expDate)} hover:bg-blue-50 transition`}
                >
                  <td className="py-2 px-2">
                    {p.image ? (
                      <img
                        src={getImageUrl(p.image)}
                        alt="product"
                        className="w-12 h-12 rounded-lg object-cover border"
                      />
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center text-[10px] bg-slate-200 rounded">
                        No Image
                      </div>
                    )}
                  </td>

                  <td className="py-2 px-2">{p.name}</td>
                  <td className="py-2 px-2">{p.category}</td>
                  <td className="py-2 px-2">{p.batch}</td>
                  <td className="py-2 px-2">{p.mfgDate}</td>
                  <td className="py-2 px-2">{p.expDate}</td>
                  <td className="py-2 px-2">{p.quantity}</td>

                  <td className="py-2 px-2 text-center">
                    <StatusBadge expDate={p.expDate} />
                  </td>

                  <td className="py-2 px-2 text-right">
                    <button
                      className="text-blue-600 hover:underline mr-3"
                      onClick={() => onEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => onDelete(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


