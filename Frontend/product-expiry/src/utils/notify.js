// src/utils/notify.js
// ONE-TIME OR PER-OPEN expiry notifications (depending on `force`).
// Exports:
//   requestNotificationPermission()
//   showNotification(title, options)
//   scheduleExpiryNotifications(products, daysBefore, force=false)

const NOTIFIED_KEY = "expiryNotifiedProducts";
const SYSTEM_FLAG_KEY = "expirySystemNotifications";
const DAY_MS = 24 * 60 * 60 * 1000;

function loadNotifiedMap() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(NOTIFIED_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (e) {
    console.warn("[notify] failed to parse notified map:", e);
    return {};
  }
}

function saveNotifiedMap(map) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(NOTIFIED_KEY, JSON.stringify(map || {}));
  } catch (e) {
    console.warn("[notify] failed to save notified map:", e);
  }
}

function makeProductKey(prod) {
  if (!prod) return "";
  if (prod.id != null) return String(prod.id);
  return `${prod.name || ""}|${prod.expDate || ""}`;
}

function systemNotificationsEnabled() {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(SYSTEM_FLAG_KEY);
    // default ON
    return raw !== "off";
  } catch {
    return true;
  }
}

// asks browser for permission, returns "granted" | "denied" | "default" | "unsupported" | "error"
export async function requestNotificationPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  try {
    const result = await Notification.requestPermission();
    console.log("Notification.requestPermission ->", result);
    return result;
  } catch (e) {
    console.error("requestNotificationPermission error:", e);
    return "error";
  }
}

// showNotification: only works when Notification.permission === "granted"
export async function showNotification(title, options = {}) {
  try {
    if (typeof window === "undefined" || !("Notification" in window)) {
      console.warn("[notify] Notifications unsupported");
      return false;
    }
    if (Notification.permission !== "granted") {
      console.warn("[notify] Permission not granted:", Notification.permission);
      return false;
    }

    // prefer service worker if registered
    if ("serviceWorker" in navigator) {
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg && typeof reg.showNotification === "function") {
          await reg.showNotification(title, options);
          return true;
        }
      } catch (swErr) {
        console.warn("[notify] serviceWorker.showNotification failed, falling back:", swErr);
      }
    }

    // fallback
    // eslint-disable-next-line no-new
    new Notification(title, options);
    return true;
  } catch (err) {
    console.error("showNotification error:", err);
    return false;
  }
}

/**
 * scheduleExpiryNotifications(products, daysBefore = 0, force = false)
 *
 * - products: array of objects with at least { id?, name, expDate }
 * - daysBefore: integer (days) - notify items that expire within this many days (inclusive)
 * - force: if true, ignore local already-notified map and show notifications again (useful to notify on every app-open)
 *
 * This function performs immediate checks only (no background setTimeouts).
 * It marks notified products in localStorage to avoid duplicate notifications unless force=true.
 */
export function scheduleExpiryNotifications(products = [], daysBefore = 0, force = false) {
  if (typeof window === "undefined") return;
  if (!Array.isArray(products)) products = [];

  if (!systemNotificationsEnabled()) {
    console.log("[notify] system notifications disabled via settings; skipping schedule");
    return;
  }
  if (!("Notification" in window)) {
    console.log("[notify] Notification API not supported, skipping");
    return;
  }
  if (Notification.permission !== "granted") {
    console.log("[notify] Permission not granted (", Notification.permission, "), skipping system notifications");
    return;
  }

  const now = new Date();
  const notifiedMap = loadNotifiedMap();
  const threshold = Number(daysBefore || 0);

  (products || []).forEach((prod) => {
    if (!prod) return;
    const key = makeProductKey(prod);
    if (!key) return;

    // skip if already notified and not forcing
    if (!force && notifiedMap[key]) return;

    const expTime = new Date(prod.expDate).getTime();
    if (Number.isNaN(expTime)) return;

    const diffMs = expTime - now.getTime();
    const diffDays = Math.floor(diffMs / DAY_MS); // full days

    // if product expires after the threshold, skip
    if (diffDays > threshold) return;

    // create a human-friendly message
    let bodyMsg = "";
    if (diffDays < 0) {
      const daysAgo = Math.abs(diffDays);
      if (daysAgo === 0) bodyMsg = `${prod.name || "Product"} has already expired.`;
      else if (daysAgo === 1) bodyMsg = `${prod.name || "Product"} expired 1 day ago.`;
      else bodyMsg = `${prod.name || "Product"} expired ${daysAgo} days ago.`;
    } else if (diffDays === 0) {
      bodyMsg = `${prod.name || "Product"} expires today.`;
    } else if (diffDays === 1) {
      bodyMsg = `${prod.name || "Product"} will expire in 1 day.`;
    } else {
      bodyMsg = `${prod.name || "Product"} will expire in ${diffDays} days.`;
    }

    // mark as notified (so it won't spam if force=false next time)
    notifiedMap[key] = true;
    saveNotifiedMap(notifiedMap);

    showNotification(`Expiry alert: ${prod.name || "Product"}`, {
      body: bodyMsg,
    });
  });

  console.log("[notify] scheduleExpiryNotifications run", {
    count: products.length,
    daysBefore: threshold,
    force,
  });
}

// expose helpers for dev console testing
if (typeof window !== "undefined") {
  window.requestNotificationPermission = requestNotificationPermission;
  window.showNotificationNow = showNotification;
  window.scheduleExpiryNotifications = scheduleExpiryNotifications;
}
