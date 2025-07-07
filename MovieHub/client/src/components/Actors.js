"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "./Actors.css"

const Actors = () => {
  const [actors, setActors] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchActors()
  }, [page])

  const fetchActors = async (search = "") => {
    setLoading(true)
    setError("")

    try {
      const params = { page }
      if (search) {
        params.search = search
      }

      const response = await axios.get("/api/actors/popular", { params })
      setActors(response.data.results)
    } catch (error) {
      setError(error.response?.data?.error || "Oyuncular yüklenirken hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchActors(searchTerm)
  }

  return (
    <div className="actors-container">
      <div className="actors-header">
        <h2>Popüler Oyuncular</h2>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Oyuncu adı ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input search-input"
          />
          <button type="submit" className="btn-primary">
            Ara
          </button>
        </form>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading">Oyuncular yükleniyor...</div>
      ) : (
        <div className="actors-grid">
          {actors.map((actor) => (
            <ActorCard key={actor.id} actor={actor} />
          ))}
        </div>
      )}

      <div className="pagination">
        <button className="btn-secondary" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
          Önceki
        </button>
        <span className="page-info">Sayfa {page}</span>
        <button className="btn-secondary" onClick={() => setPage(page + 1)}>
          Sonraki
        </button>
      </div>
    </div>
  )
}

const ActorCard = ({ actor }) => {
  return (
    <div className="actor-card">
      <div className="actor-photo">
        {actor.profile_path ? (
          <img src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`} alt={actor.name} />
        ) : (
          <div className="no-photo">Fotoğraf Yok</div>
        )}
      </div>

      <div className="actor-info">
        <h3 className="actor-name">{actor.name}</h3>

        <div className="actor-meta">
          <span className="popularity">🔥 Popülerlik: {actor.popularity?.toFixed(1) || "N/A"}</span>
        </div>

        {actor.known_for && actor.known_for.length > 0 && (
          <div className="known-for">
            <h4>Yapımlar:</h4>
            <div className="known-for-list">
              {actor.known_for.slice(0, 3).map((work, index) => (
                <span key={index} className="known-for-item">
                  {work.title || work.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Actors
