// src/pages/AuthModal.jsx
import React, { useState } from "react";
import { api } from "../api";
import { useToast } from "../components/ToastProvider.jsx"; // 👈 NEW

export default function AuthModal({ mode, onClose, onLoginSubmit }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast(); // 👈 NEW

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, phone, password, confirmPassword } = form;
    const emailTrim = email.trim().toLowerCase();

    // ---------------- REGISTER ----------------
    if (mode === "register") {
      if (!name || !email || !phone || !password || !confirmPassword) {
        const msg = "Please fill all fields.";
        setError(msg);
        toast.warning(msg, { title: "Missing fields" });
        return;
      }

      if (!/^\S+@\S+\.\S+$/.test(emailTrim)) {
        const msg = "Please enter a valid email address.";
        setError(msg);
        toast.warning(msg, { title: "Invalid email" });
        return;
      }

      if (!/^\d{10}$/.test(phone.trim())) {
        const msg = "Phone number must be 10 digits.";
        setError(msg);
        toast.warning(msg, { title: "Invalid phone" });
        return;
      }

      if (password.length < 6) {
        const msg = "Password must be at least 6 characters.";
        setError(msg);
        toast.warning(msg, { title: "Weak password" });
        return;
      }

      if (password !== confirmPassword) {
        const msg = "Passwords do not match.";
        setError(msg);
        toast.warning(msg, { title: "Password mismatch" });
        return;
      }

      try {
        setLoading(true);

        const res = await api.post("/auth/register/", {
          name: name.trim(),
          email: emailTrim,
          phone: phone.trim(),
          password,
          confirm_password: confirmPassword,
        });

        onLoginSubmit(res.data);
        toast.success("Account created and logged in.", {
          title: "Welcome 🚀",
        }); // 👈 success toast
        onClose();
      } catch (err) {
        console.error(err);

        let msg = "Registration failed. Please try again.";
        if (err.response?.data) {
          const data = err.response.data;
          if (typeof data === "string") {
            msg = data;
          } else if (Array.isArray(data)) {
            msg = data.join(", ");
          } else {
            const firstKey = Object.keys(data)[0];
            msg = Array.isArray(data[firstKey])
              ? data[firstKey][0]
              : String(data[firstKey]);
          }
        }

        setError(msg);
        toast.error(msg, { title: "Registration error" }); // 👈 error toast
      } finally {
        setLoading(false);
      }

      return;
    }

    // ---------------- LOGIN ----------------
    if (!email || !password) {
      const msg = "Please enter email and password.";
      setError(msg);
      toast.warning(msg, { title: "Missing credentials" });
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/auth/login/", {
        email: emailTrim,
        password,
      });

      onLoginSubmit(res.data);
      toast.success("Welcome back!", { title: "Login successful ✅" }); // 👈 success
      onClose();
    } catch (err) {
      console.error(err);
      const msg = "Invalid email or password.";
      setError(msg);
      toast.error(msg, { title: "Login failed" }); // 👈 fail toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {mode === "login" ? "Login" : "Create Account"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          {mode === "register" && (
            <>
              <div>
                <label className="text-xs text-slate-600 block mb-1">
                  Full Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/40"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 block mb-1">
                  Phone Number
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/40"
                  placeholder="10 digit phone"
                />
              </div>
            </>
          )}

          <div>
            <label className="text-xs text-slate-600 block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/40"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-xs text-slate-600 block mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/40"
              placeholder="********"
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="text-xs text-slate-600 block mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/40"
                placeholder="********"
              />
            </div>
          )}

          {error && (
            <p className="text-[11px] text-red-600 bg-red-100 border border-red-200 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-1 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Register"}
          </button>
        </form>

        <p className="mt-3 text-[10px] text-slate-500 text-center">
          Authentication is connected to Django backend (Register & Login use
          real database).
        </p>
      </div>
    </div>
  );
}
