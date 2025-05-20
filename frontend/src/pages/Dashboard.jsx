
import React, { useEffect, useState } from "react";
import { Line, PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement,
} from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../components/Sidebar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement
);

const dummyUsers = [
  { id: 1, username: "Big Chungus", role: "admin" },
  { id: 2, username: "Didula S.A.", role: "user" },
  { id: 3, username: "Manthila P.", role: "user" },
];

const dummyDatasets = [
  { id: 1, uploadedBy: 2, timestamp: "2024-06-01T10:00:00Z" },
  { id: 2, uploadedBy: 3, timestamp: "2024-06-02T12:00:00Z" },
  { id: 3, uploadedBy: 1, timestamp: "2024-06-03T14:00:00Z" },
  { id: 4, uploadedBy: 2, timestamp: "2024-06-04T16:00:00Z" },
];

const dummyMalwareDetections = [
  // timestamp, detectedBy (user id), count
  { timestamp: "2024-06-01", detectedBy: 1, count: 5 },
  { timestamp: "2024-06-01", detectedBy: 2, count: 2 },
  { timestamp: "2024-06-02", detectedBy: 3, count: 3 },
  { timestamp: "2024-06-02", detectedBy: 1, count: 4 },
  { timestamp: "2024-06-03", detectedBy: 2, count: 1 },
  { timestamp: "2024-06-03", detectedBy: 3, count: 2 },
  { timestamp: "2024-06-04", detectedBy: 1, count: 6 },
];

function aggregateMalwareData(detections, users) {
  // Group by date, then by admin/user
  const dateMap = {};
  detections.forEach(({ timestamp, detectedBy, count }) => {
    if (!dateMap[timestamp]) dateMap[timestamp] = { admin: 0, user: 0 };
    const user = users.find(u => u.id === detectedBy);
    if (user?.role === "admin") dateMap[timestamp].admin += count;
    else dateMap[timestamp].user += count;
  });
  const dates = Object.keys(dateMap).sort();
  const adminCounts = dates.map(date => dateMap[date].admin);
  const userCounts = dates.map(date => dateMap[date].user);
  return { dates, adminCounts, userCounts };
}

// Prepare polar area data: total detections per user
function aggregateDetectionsPerUser(users, detections) {
  return users.map(user => {
    const total = detections
      .filter(d => d.detectedBy === user.id)
      .reduce((sum, d) => sum + d.count, 0);
    return total;
  });
}

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [datasetCount, setDatasetCount] = useState(0);
  const [malwareChart, setMalwareChart] = useState({ dates: [], adminCounts: [], userCounts: [] });
  const [polarData, setPolarData] = useState({ labels: [], data: [] });

  useEffect(() => {
    // Replace with API calls in production
    setUserCount(dummyUsers.length);
    setDatasetCount(dummyDatasets.length);
    setMalwareChart(aggregateMalwareData(dummyMalwareDetections, dummyUsers));

    // Prepare polar area data
    setPolarData({
      labels: dummyUsers.map(u => u.username),
      data: aggregateDetectionsPerUser(dummyUsers, dummyMalwareDetections),
    });
  }, []);

  const chartData = {
    labels: malwareChart.dates,
    datasets: [
      {
        label: "Admin",
        data: malwareChart.adminCounts,
        borderColor: "rgba(54, 162, 235, 0.9)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: false,
        tension: 0.3,
        pointRadius: 5,
      },
      {
        label: "User",
        data: malwareChart.userCounts,
        borderColor: "rgba(255, 99, 132, 0.9)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: false,
        tension: 0.3,
        pointRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Malware Detections Over Time" },
    },
    scales: {
      x: { title: { display: true, text: "Date" } },
      y: { title: { display: true, text: "Malware Detections" }, beginAtZero: true },
    },
  };

  const polarAreaData = {
    labels: polarData.labels,
    datasets: [
      {
        label: "Total Malware Detections",
        data: polarData.data,
        backgroundColor: [
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 99, 132, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 159, 64, 0.7)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const polarAreaOptions = {
    responsive: true,
    plugins: {
      legend: { position: "right" },
      title: { display: true, text: "Total Malware Detections per User" },
    },
  };

  return (
    <div className="d-flex">
      <Sidebar current="Dashboard" />
      <main className="flex-grow-1 p-4 bg-light min-vh-100 overflow-auto">
        <h1 className="mb-4">Dashboard</h1>
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="rounded shadow bg-primary text-white text-center py-4">
              <h2 className="display-5">{userCount}</h2>
              <div>Users</div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="rounded shadow bg-success text-white text-center py-4">
              <h2 className="display-5">{datasetCount}</h2>
              <div>Datasets Uploaded</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded shadow p-4 mb-5">
          <Line data={chartData} options={chartOptions} />
        </div>
        <div className="bg-white rounded shadow p-4">
          <h5 className="mb-3">Malware Detections Polar Area Chart</h5>
          <PolarArea data={polarAreaData} options={polarAreaOptions} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
