import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggle = () => {
    setIsSignUp((p) => !p);
    setForm({ email: "", password: "", confirm: "" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp && form.password !== form.confirm) {
      alert("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const endpoint = isSignUp ? "/signup" : "/login"; // TODO: create these endpoints
      const { data } = await axios.post(endpoint, {
        email: form.email,
        password: form.password,
      });
      localStorage.setItem("authToken", data.token || "dummy-token");
      navigate("/upload");
    } catch (err) {
      alert(err.response?.data?.error || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow" style={{ width: "420px" }}>
        <div className="card-body p-4">
          <h2 className="h4 mb-4 text-center">{isSignUp ? "Create account" : "Sign in"}</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={form.password}
                onChange={handleChange}
                minLength={6}
                required
              />
            </div>
            {isSignUp && (
              <div className="mb-3">
                <label className="form-label">Confirm password</label>
                <input
                  type="password"
                  className="form-control"
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                  minLength={6}
                  required
                />
              </div>
            )}

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Please wait…" : isSignUp ? "Sign up" : "Sign in"}
            </button>
          </form>

          <hr className="my-4" />

          <p className="text-center m-0">
            {isSignUp ? "Already have an account?" : "New here?"}
            <button className="btn btn-link p-0 ms-1" onClick={toggle}>
              {isSignUp ? "Sign in" : "Create one"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

