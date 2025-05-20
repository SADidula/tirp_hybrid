
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getRoleFromToken } from "../utils/auth";
import Sidebar from "../../components/Sidebar";

export default function Models() {
    const [models, setModels] = useState([
        {
            id: 1,
            name: "HybridNet v1",
            accuracy: 0.95,
            f1_score: 0.93,
            precision: 0.92,
            recall: 0.94,
        },
        {
            id: 2,
            name: "Stacked Ensemble",
            accuracy: 0.92,
            f1_score: 0.90,
            precision: 0.89,
            recall: 0.91,
        },
        {
            id: 3,
            name: "Random Forest Hybrid",
            accuracy: 0.90,
            f1_score: 0.88,
            precision: 0.87,
            recall: 0.89,
        },
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Uncomment and use this effect to fetch from API when ready
    /*
    useEffect(() => {
        setLoading(true);
        axios.get("/models")
            .then(res => {
                setModels(res.data);
                setLoading(false);
            })
            .catch(err => {
                setError("Failed to load models.");
                setLoading(false);
            });
    }, []);
    */

    // Optional: Only allow admin to view this page
    const role = getRoleFromToken();
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

    return (
        <div className="d-flex">
            <Sidebar current="Model History" />
            <main className="flex-grow-1 p-4 bg-light min-vh-100 overflow-auto">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h3 m-0">Hybrid ML Models</h1>
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                {loading ? (
                    <div>Loading models...</div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Accuracy</th>
                                    <th>F1-Score</th>
                                    <th>Precision</th>
                                    <th>Recall</th>
                                </tr>
                            </thead>
                            <tbody>
                                {models.map(model => (
                                    <tr key={model.id}>
                                        <td>{model.id}</td>
                                        <td>{model.name}</td>
                                        <td>{(model.accuracy * 100).toFixed(2)}%</td>
                                        <td>{(model.f1_score * 100).toFixed(2)}%</td>
                                        <td>{(model.precision * 100).toFixed(2)}%</td>
                                        <td>{(model.recall * 100).toFixed(2)}%</td>
                                    </tr>
                                ))}
                                {models.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-center text-muted">
                                            No models found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
