import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Trash2, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  /* load once */
  useEffect(() => {
    const h = JSON.parse(localStorage.getItem("predictionHistory") || "[]");
    setHistory(h.reverse());
  }, []);

  /* clear all */
  const clearHistory = () => {
    if (window.confirm("Clear all history?")) {
      localStorage.removeItem("predictionHistory");
      setHistory([]);
    }
  };

  /* download helper */
  const downloadCsv = (b64, fileName = "file.csv") => {
    const blob = new Blob([atob(b64)], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="d-flex">
      <Sidebar current="History" />

      <main className="flex-grow-1 p-4 bg-light min-vh-100 overflow-auto">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 m-0">Prediction History</h1>
          {history.length > 0 && (
            <button className="btn btn-outline-danger" onClick={clearHistory}>
              <Trash2 size={16} className="me-1" /> Clear
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <p className="text-muted">No past predictions yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Filename</th>
                  <th>Rows</th>
                  <th>Top classes</th>
                  <th style={{ width: "120px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => {
                  const { summary } = h.data;
                  return (
                    <tr key={i}>
                      <td>{new Date(h.timestamp).toLocaleString()}</td>
                      <td>{summary.filename}</td>
                      <td>{summary.total_rows}</td>
                      <td>
                        {Object.entries(summary.class_counts)
                          .slice(0, 3)
                          .map(([c, n]) => `${c}: ${n}`)
                          .join(", ")}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => navigate("/charts", { state: { results: h.data } })}
                        >
                          View charts
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => downloadCsv(h.csvB64, h.fileName)}
                          title="Download original CSV"
                        >
                          <Download size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
