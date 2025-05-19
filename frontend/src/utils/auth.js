export function logout(navigate) {
    localStorage.removeItem("authToken");
    navigate("/auth", { replace: true });
  }
  