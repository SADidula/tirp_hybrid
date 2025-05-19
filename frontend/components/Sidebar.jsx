// src/components/Sidebar.jsx
import React from "react";
import { UploadCloud, BarChart3, FileText, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../src/utils/auth";          // ← adjust path if utils lives elsewhere

export default function Sidebar({ current }) {
  const navigate = useNavigate();

  const items = [
    { name: "Upload",  icon: UploadCloud, route: "/upload" },
    { name: "Charts",  icon: BarChart3,   route: "/charts" },
    { name: "History", icon: FileText,    route: "/history" },
  ];

  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark"
      style={{ width: "260px", minHeight: "100vh" }}
    >
      <span className="fs-4 mb-4">MalDetect Admin</span>

      <ul className="nav nav-pills flex-column mb-auto gap-1">
        {items.map(({ name, icon: Icon, route }) => (
          <li key={name} className="nav-item">
            <Link
              to={route}
              className={`nav-link d-flex align-items-center gap-2 ${
                current === name ? "active" : "text-white"
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
