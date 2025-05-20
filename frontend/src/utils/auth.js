export function logout(navigate) {
  localStorage.removeItem("authToken");
  navigate("/auth", { replace: true });
}


// Helper to decode JWT payload
export function getRoleFromToken() {
  const token = localStorage.getItem("authToken");
  if (!token) return null;
  try {
    const decoded = JSON.parse(token);
    return decoded.role || null;
  } catch (e) {
    return null;
  }
}