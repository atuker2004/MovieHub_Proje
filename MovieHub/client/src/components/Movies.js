"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import "./Movies.css"

const Movies = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchMovies()
  }, [page])

  const fetchMovies = async (search = "") => {
    setLoading(true)
    setError("")

    try {
      const params = { page }
      if (search) {
        params.search = search
      }

      const response = await axios.get("/api/movies/popular", { params })
      setMovies(response.data.results)
    } catch (error) {
      setError(error.response?.data?.error || "Filmler yüklenirken hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchMovies(searchTerm)
  }

  const handleRating = async (movieId, rating, note) => {
    try {
      await axios.post(`/api/movies/${movieId}/rate`, { rating, note })
      // Filmleri yeniden yükle
      fetchMovies(searchTerm)
    } catch (error) {
      setError("Puan kaydedilirken hata oluştu")
    }
  }

  return (
    <div className="movies-container">
      <div className="movies-header">
        <h2>Popüler Filmler</h2>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Film adı ara..."
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
        <div className="loading">Filmler yükleniyor...</div>
      ) : (
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onRate={handleRating} />
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

const MovieCard = ({ movie, onRate }) => {
  const [showRating, setShowRating] = useState(false)
  const [rating, setRating] = useState(movie.user_rating || "")
  const [note, setNote] = useState(movie.user_note || "")

  const handleSubmitRating = (e) => {
    e.preventDefault()
    onRate(movie.id, rating ? Number.parseInt(rating) : null, note)
    setShowRating(false)
  }

  return (
    <div className="movie-card">
      <div className="movie-poster">
        {movie.poster_path ? (
          <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} />
        ) : (
          <div className="no-poster">Poster Yok</div>
        )}
      </div>
       <Link style={{color:"white",listStyleType:"none",textDecoration:"none"}} to={`/dashboard/movies/${movie.id}`}>
       <div className="movie-info">
        <h3 className="movie-title">
          
          <div>{movie.title}</div>
        </h3>

        <p className="movie-overview">{movie.overview ? movie.overview.substring(0, 150) + "..." : "Açıklama yok"}</p>

        <div className="movie-meta">
          <span className="release-date">
            📅 {movie.release_date ? new Date(movie.release_date).getFullYear() : "Bilinmiyor"}
          </span>
          <span className="vote-average">⭐ {movie.vote_average?.toFixed(1) || "N/A"}</span>
        </div>

        {movie.user_rating && (
          <div className="user-rating">
            <span className="rating-stars">
              {"★".repeat(movie.user_rating)} ({movie.user_rating}/10)
            </span>
          </div>
        )}

        <div className="movie-actions">
          <button className="btn-secondary" onClick={() => setShowRating(!showRating)}>
            {movie.user_rating ? "Puanı Düzenle" : "Puan Ver"}
          </button>
        </div>

        {showRating && (
          <form onSubmit={handleSubmitRating} className="rating-form">
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
                rows="3"
                placeholder="Filim hakkında notunuz..."
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
      </Link>
    </div>
  )
}

export default Movies
