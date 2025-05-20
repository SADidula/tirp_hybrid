
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { logout, getRoleFromToken } from "../utils/auth";
import { UploadCloud, BarChart3, FileText, LogOut, Users, Trash2, Download, ShieldCheck, ShieldOff } from "lucide-react";
import Papa from "papaparse";
import { useNavigate, Navigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

export default function MngUsers() {
    const [history, setHistory] = useState([]);
    const [users, setUsers] = useState([
        { id: 1, username: "Big Chungus", email: "chnugus@gmail.com", role: "admin" },
        { id: 2, username: "Didula S.A.",  email: "didula@swin.edu.au", role: "user" },
        { id: 3, username: "Manthila P.",  email: "manthila@rocketmail.com", role: "user" },
    ]);
    const [actionLoading, setActionLoading] = useState({});
    // Check role
    const role = getRoleFromToken();

    // If not admin, redirect or show not authorized
    if (role !== "admin") {
        return (
            <div className="d-flex">
                <Sidebar current="" />
                <main className="flex-grow-1 p-4 bg-light min-vh-100 overflow-auto d-flex align-items-center justify-content-center">
                    <div className="alert alert-danger text-center" role="alert">
                        You are not authorized to view this page.
                    </div>
                </main>
            </div>
        );
    }

    // Dummy grant admin
    const grantAdmin = (id) => {
        setActionLoading(a => ({ ...a, [id]: true }));
        setTimeout(() => {
            setUsers(users =>
                users.map(u =>
                    u.id === id ? { ...u, role: "admin" } : u
                )
            );
            setActionLoading(a => ({ ...a, [id]: false }));
        }, 500);
    };

    // Dummy revoke admin
    const revokeAdmin = (id) => {
        setActionLoading(a => ({ ...a, [id]: true }));
        setTimeout(() => {
            setUsers(users =>
                users.map(u =>
                    u.id === id ? { ...u, role: "user" } : u
                )
            );
            setActionLoading(a => ({ ...a, [id]: false }));
        }, 500);
    };

    // Dummy delete user
    const deleteUser = (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        setActionLoading(a => ({ ...a, [id]: true }));
        setTimeout(() => {
            setUsers(users => users.filter(u => u.id !== id));
            setActionLoading(a => ({ ...a, [id]: false }));
        }, 500);
    };

    return (
        <div className="d-flex">
            <Sidebar current="Manage Users" />

            <main className="flex-grow-1 p-4 bg-light min-vh-100 overflow-auto">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h3 m-0">Manage Users</h1>
                </div>

                {/* Dummy Users Table */}
                <div className="mb-4">
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th style={{ width: "220px" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            {user.role === "admin" ? (
                                                <span className="badge bg-success">Admin</span>
                                            ) : (
                                                <span className="badge bg-secondary">User</span>
                                            )}
                                        </td>
                                        <td>
                                            {user.role === "admin" ? (
                                                <button
                                                    className="btn btn-sm btn-warning me-2"
                                                    disabled={actionLoading[user.id]}
                                                    onClick={() => revokeAdmin(user.id)}
                                                >
                                                    <ShieldOff size={14} className="me-1" />
                                                    Revoke Admin
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-sm btn-success me-2"
                                                    disabled={actionLoading[user.id]}
                                                    onClick={() => grantAdmin(user.id)}
                                                >
                                                    <ShieldCheck size={14} className="me-1" />
                                                    Grant Admin
                                                </button>
                                            )}
                                            <button
                                                className="btn btn-sm btn-danger"
                                                disabled={actionLoading[user.id]}
                                                onClick={() => deleteUser(user.id)}
                                            >
                                                <Trash2 size={14} className="me-1" />
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center text-muted">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
