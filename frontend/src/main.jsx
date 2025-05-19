import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Upload from './pages/Upload'
import Dashboard from './pages/Dashboard'
import History  from "./pages/History";
import ChartsPage  from "./pages/Charts";
import './index.css'
import Auth from "./pages/Auth"
const requireAuth = (element) =>
  localStorage.getItem("authToken")         
    ? element
    : <Navigate to="/auth" replace />;

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/upload" replace />} />
      <Route path="/upload" element={requireAuth(<Upload />)} />
      <Route path="/history" element={requireAuth(<History />)} />
      <Route path="/charts" element={requireAuth(<ChartsPage />)} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  </BrowserRouter>
);


ReactDOM.createRoot(document.getElementById('root')).render(<App />)
