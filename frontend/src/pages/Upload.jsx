import React, { useState, useMemo } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { logout } from "../utils/auth";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { UploadCloud, BarChart3, FileText,LogOut } from "lucide-react";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom"; 
import Sidebar  from "../../components/Sidebar";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

/* ───────────────────── Sidebar ───────────────────── */


/* ──────────────────── Upload Page ─────────────────── */
export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);       // backend response
  const [fileStats, setFileStats] = useState(null);   // rows / cols / size
  const [loading, setLoading] = useState(false);

  /* counts per predicted class (backend summary) */
  const classCounts = results?.summary?.class_counts ?? {};

  /* ───── handle upload ───── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    /* quick client-side CSV stats */
    Papa.parse(file, {
      header: true,
      worker: true,
      complete: (parsed) => {
        setFileStats({
          rows: parsed.data.length,
          cols: Object.keys(parsed.data[0] || {}).length,
          sizeKb: (file.size / 1024).toFixed(1),
          name: file.name,
        });
      },
    });

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const { data } = await axios.post("/predict", fd);
      setResults(data);

      /* ── save run + original CSV ── */
      const csvText = await file.text();                 // read uploaded file
      const history = JSON.parse(localStorage.getItem("predictionHistory") || "[]");
      history.push({
        timestamp: Date.now(),
        csvB64: btoa(csvText),                           // base-64 original CSV
        fileName: file.name,
        data,
      });
    localStorage.setItem("predictionHistory", JSON.stringify(history));
    } catch (err) {
      alert(err.response?.data?.error || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  /* ───── Chart datasets ───── */
  const barData = useMemo(() => {
    const labels = Object.keys(classCounts);
    return {
      labels,
      datasets: [
        {
          label: "Count",
          data: labels.map((l) => classCounts[l]),
          backgroundColor: "rgba(13,110,253,0.6)",
        },
      ],
    };
  }, [classCounts]);

  const doughnutData = useMemo(() => {
    const labels = Object.keys(classCounts);
    return {
      labels,
      datasets: [
        {
          data: labels.map((l) => classCounts[l]),
          backgroundColor: ["#0d6efd", "#6610f2", "#6f42c1", "#d63384", "#dc3545"],
        },
      ],
    };
  }, [classCounts]);

  /* ────────────────────────── render ────────────────────────── */
  return (
    <div className="d-flex">
      <Sidebar current="Upload" />

      <main className="flex-grow-1 p-4 bg-light min-vh-100 overflow-auto">
        <h1 className="h3 mb-4">Upload CSV for Prediction</h1>

        {/* upload form */}
        <form onSubmit={handleSubmit} className="card card-body mb-4">
          <div className="row g-3 align-items-center">
            <div className="col-md-8">
              <input
                type="file"
                accept=".csv"
                className="form-control"
                onChange={(e) => setFile(e.target.files[0] || null)}
              />
            </div>
            <div className="col-md-4 d-grid gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!file || loading}
              >
                {loading ? "Uploading…" : "Predict"}
              </button>
            </div>
          </div>
        </form>

        {/* basic file stats */}
        {fileStats && (
          <div className="card card-body mb-4">
            <h2 className="h5 mb-3">Uploaded File Analysis</h2>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Filename: {fileStats.name}</li>
              <li className="list-group-item">Size: {fileStats.sizeKb} KB</li>
              <li className="list-group-item">Rows: {fileStats.rows}</li>
              <li className="list-group-item">Columns: {fileStats.cols}</li>
            </ul>
          </div>
        )}

        {/* top-10 row preview */}
        {results && (
          <div className="card card-body mb-4">
            <h2 className="h5 mb-3">Top 10 Predictions</h2>
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Prediction</th>
                    <th>Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {results.predictions.slice(0, 10).map((pred, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td className="text-capitalize">{pred}</td>
                      <td>{(results.confidence[i] * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* charts */}
        {results && (
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="card card-body">
                <h3 className="h6">Class Distribution</h3>
                <div style={{ height: "400px", maxHeight: "400px" }}>
                  <Bar data={barData} options={{ maintainAspectRatio: false }} />
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card card-body">
                <h3 className="h6">Class Share</h3>
                <div style={{ height: "400px", maxHeight: "400px" }}>
                  <Doughnut
                    data={doughnutData}
                    options={{ maintainAspectRatio: false, cutout: "60%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
