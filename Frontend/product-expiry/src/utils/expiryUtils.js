export function getDaysRemaining(expDateStr) {
  const today = new Date();
  const exp = new Date(expDateStr);
  if (isNaN(exp.getTime())) return NaN;

  today.setHours(0, 0, 0, 0);
  exp.setHours(0, 0, 0, 0);
  const diffMs = exp.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function getStatus(expDateStr) {
  const days = getDaysRemaining(expDateStr);

  if (Number.isNaN(days)) {
    return { label: "Invalid", level: "invalid", days: null };
  }
  if (days < 0) return { label: "Expired", level: "expired", days };
  if (days <= 7) return { label: `Near Expiry (${days}d)`, level: "near", days };
  return { label: `Safe (${days}d)`, level: "safe", days };
}
