"use client"

import { useState } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Sidebar from "./Sidebar"
import Movies from "./Movies"
import Actors from "./Actors"
import Recommend from "./Recommend"
import MovieDetail from "./MovieDetail"
import { useAuth } from "../contexts/AuthContext"
import "./Dashboard.css"

const Dashboard = () => {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <div className="logo">
                        <h1 style={{marginLeft:"750px"}} >ᗰOᐯIEᕼᑌᗷ</h1>

            </div>
        </div>
        <div className="header-right">
          <span className="user-info">
            İyi Seyirler, <strong>{user?.username}</strong>
          </span>
          <button className="btn-secondary" onClick={handleLogout}>
            🚪 Çıkış Yap
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <Sidebar isOpen={sidebarOpen} />
        <div className={`main-content ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
          <Routes>
            <Route path="/" element={<Navigate to="movies" replace />} />
            <Route path="movies" element={<Movies />} />
            <Route path="movies/:id" element={<MovieDetail />} />
            <Route path="actors" element={<Actors />} />
            <Route path="recommend" element={<Recommend />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
