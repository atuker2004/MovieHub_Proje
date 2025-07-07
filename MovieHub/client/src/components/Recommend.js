"use client"

import { useState } from "react"
import axios from "axios"
import "./Recommend.css"

const Recommend = () => {
  const [query, setQuery] = useState("")
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [hasSearched, setHasSearched] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!query.trim()) {
      setError("Lütfen bir film adı girin")
      return
    }

    setLoading(true)
    setError("")
    setHasSearched(true)

    try {
      const response = await axios.post("/api/movies/recommend", { query })
      setRecommendations(response.data.suggestions)
    } catch (error) {
      setError(error.response?.data?.error || "Film önerisi alınırken hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="recommend-container">
      <div className="recommend-header">
        <h2>Film Önerisi</h2>
        <p className="recommend-description">Aradığınız film adını yazın, size benzer filmleri önerelim!</p>
      </div>

      <form onSubmit={handleSubmit} className="recommend-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Film adı yazın... (örn: Inception, Avatar, Titanic)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="form-input recommend-input"
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn-primary recommend-button" disabled={loading || !query.trim()}>
          {loading ? "Öneriler Getiriliyor..." : "Film Öner"}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {hasSearched && !loading && (
        <div className="recommendations-section">
          <h3>
            "{query}" için öneriler
            {recommendations.length > 0 && <span className="results-count">({recommendations.length} sonuç)</span>}
          </h3>

          {recommendations.length === 0 ? (
            <div className="no-results">
              <p>Bu arama için film bulunamadı. Farklı bir film adı deneyin.</p>
            </div>
          ) : (
            <div className="recommendations-grid">
              {recommendations.map((movie) => (
                <RecommendationCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const RecommendationCard = ({ movie }) => {
  return (
    <div className="recommendation-card">
      <div className="recommendation-poster">
        {movie.poster_path ? (
          <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} />
        ) : (
          <div className="no-poster">Poster Yok</div>
        )}
      </div>

      <div className="recommendation-info">
        <h4 className="recommendation-title">{movie.title}</h4>

        <div className="recommendation-meta">
          <span className="release-date">
            📅 {movie.release_date ? new Date(movie.release_date).getFullYear() : "Bilinmiyor"}
          </span>
          <span className="vote-average">⭐ {movie.vote_average?.toFixed(1) || "N/A"}</span>
        </div>

        <p className="recommendation-overview">
          {movie.overview
            ? movie.overview.length > 120
              ? movie.overview.substring(0, 120) + "..."
              : movie.overview
            : "Açıklama bulunmuyor."}
        </p>
      </div>
    </div>
  )
}

export default Recommend
