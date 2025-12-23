// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { api } from "../api";

export default function Profile({ user, setUser }) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🟢 Load from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");
        setSuccess("");

        const res = await api.get(`/profile/${user.id}/`);
        const data = res.data;

        setForm({
          full_name: data.full_name || user.name || "",
          email: data.email || user.email || "",
          phone: data.phone || user.phone || "",
          address: data.address || "",
          role: data.role || user.role || "",
        });
      } catch (err) {
        console.error("Profile load error:", err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🟡 Save / Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.full_name || !form.phone) {
      setError("Name and Phone are required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        full_name: form.full_name,
        phone: form.phone,
        address: form.address,
      };

      const res = await api.put(`/profile/${user.id}/`, payload);
      const updated = res.data;

      // React ke global user state ko bhi update karo
      const newUser = {
        ...user,
        name: updated.full_name,
        phone: updated.phone,
      };
      setUser(newUser);
      localStorage.setItem("expiryAuthUser", JSON.stringify(newUser));

      setSuccess("Profile updated successfully.");
    } catch (err) {
      console.error("Profile save error:", err);
      setError("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 flex justify-center px-4 py-6 overflow-auto">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">
          Profile
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          View and update your account details.
        </p>

        {error && (
          <p className="text-xs mb-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        {success && (
          <p className="text-xs mb-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <div>
            <label className="text-xs text-slate-600 block mb-1">
              Full Name
            </label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/40"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="text-xs text-slate-600 block mb-1">
              Email (login)
            </label>
            <input
              name="email"
              value={form.email}
              disabled
              className="w-full border border-slate-200 bg-slate-50 text-slate-500 rounded-xl px-3 py-2"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Email change ke liye admin/owner se contact karein.
            </p>
          </div>

          <div>
            <label className="text-xs text-slate-600 block mb-1">
              Phone
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/40"
              placeholder="10 digit phone"
            />
          </div>

          <div>
            <label className="text-xs text-slate-600 block mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/40 resize-none"
              placeholder="Shop / store address (optional)"
            />
          </div>

          <div>
            <label className="text-xs text-slate-600 block mb-1">
              Role
            </label>
            <input
              value={form.role || "User"}
              disabled
              className="w-full border border-slate-200 bg-slate-50 text-slate-500 rounded-xl px-3 py-2"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
