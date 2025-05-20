
import React from "react";
import { UploadCloud, BarChart3, FileText, LogOut, Users, History, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { logout, getRoleFromToken } from "../src/utils/auth"; // Adjust path if needed

export default function Sidebar({ current }) {
  const navigate = useNavigate();

  // Determine role and label
  const role = getRoleFromToken();
  const label = role === "admin" ? "MalDetect Admin" : "MalDetect User";

  // Define all items, but only include Manage Users if admin
  const items = [
    ...(role === "admin"
      ? [
        { name: "Dashboard", icon: Home, route: "/dashboard" },
      ]
      : []),
    { name: "Upload", icon: UploadCloud, route: "/upload" },
    { name: "Charts", icon: BarChart3, route: "/charts" },
    { name: "History", icon: FileText, route: "/history" },
    ...(role === "admin"
      ? [
        { name: "Manage Users", icon: Users, route: "/users" },
        { name: "Model History", icon: History, route: "/models" }
      ]
      : []),
  ];

  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark"
      style={{ width: "260px", minHeight: "100vh" }}
    >
      <span className="fs-4 mb-4">{label}</span>

      <ul className="nav nav-pills flex-column mb-auto gap-1">
        {items.map(({ name, icon: Icon, route }) => (
          <li key={name} className="nav-item">
            <Link
              to={route}
              className={`nav-link d-flex align-items-center gap-2 ${current === name ? "active" : "text-white"
                }`}
            >
              <Icon size={18} /> {name}
            </Link>
          </li>
        ))}
      </ul>

      <hr />

      <button
        className="btn btn-outline-light d-flex align-items-center gap-2 mt-auto"
        onClick={() => logout(navigate)}
      >
        <LogOut size={18} /> Logout
      </button>
    </div>
  );
}
