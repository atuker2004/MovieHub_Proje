"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"
import "./MovieDetail.css"

const MovieDetail = () => {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showRating, setShowRating] = useState(false)
  const [rating, setRating] = useState("")
  const [note, setNote] = useState("")

  useEffect(() => {
    fetchMovieDetail()
  }, [id])

  const fetchMovieDetail = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await axios.get(`/api/movies/${id}`)
      const movieData = response.data
      setMovie(movieData)
      setRating(movieData.user_rating || "")
      setNote(movieData.user_note || "")
    } catch (error) {
      setError(error.response?.data?.error || "Film detayları yüklenirken hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitRating = async (e) => {
    e.preventDefault()

    try {
      await axios.post(`/api/movies/${id}/rate`, {
        rating: rating ? Number.parseInt(rating) : null,
        note,
      })
      setShowRating(false)
      fetchMovieDetail() // Güncel verileri al
    } catch (error) {
      setError("Puan kaydedilirken hata oluştu")
    }
  }

  if (loading) {
    return <div className="loading">Film detayları yükleniyor...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  if (!movie) {
    return <div className="error">Film bulunamadı</div>
  }

  return (
    <div className="movie-detail-container">
      <div className="movie-detail-header">
        <Link to="/dashboard/movies" className="back-link">
          ← Filmlere Dön
        </Link>
      </div>

      <div className="movie-detail-content">
        <div className="movie-poster-large">
          {movie.poster_path ? (
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
          ) : (
            <div className="no-poster-large">Poster Yok</div>
          )}
        </div>

        <div className="movie-info-detailed">
          <h1 className="movie-title-large">{movie.title}</h1>

          {movie.tagline && <p className="movie-tagline">"{movie.tagline}"</p>}

          <div className="movie-stats">
            <div className="stat-item">
              <span className="stat-label">IMDB Puanı:</span>
              <span className="stat-value">⭐ {movie.vote_average?.toFixed(1) || "N/A"}</span>
            </div>

            {movie.average_rating && (
              <div className="stat-item">
                <span className="stat-label">Ortalama Puan:</span>
                <span className="stat-value">📊 {movie.average_rating.toFixed(1)}/10</span>
              </div>
            )}

            <div className="stat-item">
              <span className="stat-label">Çıkış Tarihi:</span>
              <span className="stat-value">
                📅 {movie.release_date ? new Date(movie.release_date).toLocaleDateString("tr-TR") : "Bilinmiyor"}
              </span>
            </div>

            <div className="stat-item">
              <span className="stat-label">Süre:</span>
              <span className="stat-value">⏱️ {movie.runtime ? `${movie.runtime} dk` : "Bilinmiyor"}</span>
            </div>
          </div>

          {movie.genres && movie.genres.length > 0 && (
            <div className="movie-genres">
              <h3>Türler:</h3>
              <div className="genres-list">
                {movie.genres.map((genre) => (
                  <span key={genre.id} className="genre-badge">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="movie-overview-detailed">
            <h3>Özet:</h3>
            <p>{movie.overview || "Özet bilgisi bulunmuyor."}</p>
          </div>

          <div className="user-interaction">
            <h3>Sizin Değerlendirmeniz:</h3>

            {movie.user_rating && (
              <div className="current-rating">
                <span className="rating-display">
                  Puanınız:{" "}
                  <span className="rating-stars">
                    {"★".repeat(movie.user_rating)} ({movie.user_rating}/10)
                  </span>
                </span>
              </div>
            )}

            {movie.user_note && (
              <div className="current-note">
                <h4>Notunuz:</h4>
                <p className="note-text">{movie.user_note}</p>
              </div>
            )}

            <button className="btn-primary" onClick={() => setShowRating(!showRating)}>
              {movie.user_rating ? "Puanı Düzenle" : "Puan Ver"}
            </button>

            {showRating && (
              <form onSubmit={handleSubmitRating} className="rating-form-detailed">
                <div className="form-group">
                  <label>Puan (1-10):</label>
                  <select value={rating} onChange={(e) => setRating(e.target.value)} className="form-input">
                    <option value="">Puan seçin</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Not:</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="form-input"
                    rows="4"
                    placeholder="Film hakkında düşünceleriniz..."
                  />
                </div>

                <div className="rating-actions">
                  <button type="submit" className="btn-primary">
                    Kaydet
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => setShowRating(false)}>
                    İptal
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetail
