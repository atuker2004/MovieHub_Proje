"use client"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import "./Sidebar.css"

const Sidebar = ({ isOpen }) => {
  const { user } = useAuth()
  const location = useLocation()

  const menuItems = [
    {
      path: "/dashboard/movies",
      label: "Popüler Film Listele",
      icon: "🎬",
      permission: "movies",
    },
    {
      path: "/dashboard/actors",
      label: "Popüler Oyuncu Listele",
      icon: "🎭",
      permission: "actors",
    },
    {
      path: "/dashboard/recommend",
      label: "Film Öner",
      icon: "💡",
      permission: null, // Herkese açık
    },
  ]

  const filteredMenuItems = menuItems.filter((item) => !item.permission || user?.permissions?.includes(item.permission))

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-content">
        <div className="sidebar-menu">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${location.pathname === item.path ? "active" : ""}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="user-permissions">
            <h4>Yetkileriniz:</h4>
            <div className="permissions-list">
              {user?.permissions?.includes("movies") && <span className="permission-badge">Filmler</span>}
              {user?.permissions?.includes("actors") && <span className="permission-badge">Oyuncular</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
