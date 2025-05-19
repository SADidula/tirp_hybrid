import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

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

import Sidebar from "../../components/Sidebar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function ChartsPage() {
  const { state }      = useLocation();          // results passed via navigate()
  const navigate       = useNavigate();
  const results        = state?.results;

  /* fallback – allow History page to reopen charts */
  const fromHistory = !results && JSON.parse(
    localStorage.getItem("predictionHistory") || "[]"
  )[0]?.data;
  const dataObj = results || fromHistory;

  /* if nothing to show — bounce to Upload */
  if (!dataObj) {
    navigate("/upload", { replace: true });
    return null;
  }

  const summary      = dataObj.summary;
  const classCounts  = summary.class_counts;
  const predictions  = dataObj.predictions;
  const confidence   = dataObj.confidence;

  /* datasets ------------------------------------------------- */
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
          backgroundColor: [
            "#0d6efd",
            "#6610f2",
            "#6f42c1",
            "#d63384",
            "#dc3545",
            "#fd7e14",
            "#ffc107",
            "#198754",
            "#20c997",
          ],
        },
      ],
    };
  }, [classCounts]);

  /* render --------------------------------------------------- */
  return (
    <div className="d-flex">
      <Sidebar current="Charts" />

      <main className="flex-grow-1 p-4 bg-light min-vh-100 overflow-auto">
        <h1 className="h3 mb-4">Results for &ldquo;{summary.filename}&rdquo;</h1>

        {/* quick stats */}
        <div className="row g-3 mb-4">
          <div className="col-lg-4">
            <div className="card card-body text-center">
              <h6>Total rows</h6>
              <span className="display-6">{summary.total_rows}</span>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card card-body text-center">
              <h6>Distinct classes</h6>
              <span className="display-6">{Object.keys(classCounts).length}</span>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card card-body text-center">
              <h6>Top class</h6>
              <span className="display-6 text-capitalize">
                {
                  Object.entries(classCounts)
                    .sort((a, b) => b[1] - a[1])[0][0]
                }
              </span>
            </div>
          </div>
        </div>

        {/* bar + doughnut */}
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card card-body">
              <h3 className="h6">Class Distribution</h3>
              <div style={{ height: "400px" }}>
                <Bar data={barData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card card-body">
              <h3 className="h6">Class Share</h3>
              <div style={{ height: "400px" }}>
                <Doughnut
                  data={doughnutData}
                  options={{ maintainAspectRatio: false, cutout: "60%" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* full predictions table (optional, collapsed) */}
        <details className="mt-5">
          <summary className="h6">Show full prediction list</summary>
          <div className="table-responsive mt-3">
            <table className="table table-sm table-striped table-bordered">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Prediction</th>
                  <th>Confidence</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((pred, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td className="text-capitalize">{pred}</td>
                    <td>{(confidence[i] * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </main>
    </div>
  );
}
