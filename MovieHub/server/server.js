const express = require("express")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const axios = require("axios")
const path = require("path")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// TheMovieDB API yapılandırması
const TMDB_API_KEY = "ff9a64c2a4e735039a74fef7ae6bc762"
const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const TMDB_ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZjlhNjRjMmE0ZTczNTAzOWE3NGZlZjdhZTZiYzc2MiIsIm5iZiI6MTc1MTEyMTQ2MC40NDEsInN1YiI6IjY4NWZmZTM0ODQ4ZDU5ODcxYjBkOGU1NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.c1hds17XF2zDoSwUyx8I65JoVtdlUXOD6QL4CKQPPjc"

// Sabit kullanıcılar
const users = [
  { id: 1, username: "admin", password: "admin123", role: "admin", permissions: ["movies", "actors"] },
  { id: 2, username: "movieuser", password: "movie123", role: "movie_user", permissions: ["movies"] },
  { id: 3, username: "actoruser", password: "actor123", role: "actor_user", permissions: ["actors"] },
]

// Kullanıcı notları ve puanları
const userRatings = {}
const userNotes = {}

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here"

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Access token required" })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" })
    }
    req.user = user
    next()
  })
}

// TMDB API helper
const tmdbRequest = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      params: {
        ...params,
        language: "tr-TR",
      },
    })
    return response.data
  } catch (error) {
    console.error("TMDB API Error:", error.response?.data || error.message)
    throw error
  }
}

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend çalışıyor!", timestamp: new Date().toISOString() })
})

// Login endpoint
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body

  const user = users.find((u) => u.username === username && u.password === password)

  if (!user) {
    return res.status(401).json({ error: "Geçersiz kullanıcı adı veya şifre" })
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
      permissions: user.permissions,
    },
    JWT_SECRET,
    { expiresIn: "24h" },
  )

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      permissions: user.permissions,
    },
  })
})

// Kullanıcı bilgilerini al
app.get("/api/auth/me", authenticateToken, (req, res) => {
  res.json({ user: req.user })
})

// Popüler filmleri getir
app.get("/api/movies/popular", authenticateToken, async (req, res) => {
  try {
    if (!req.user.permissions.includes("movies")) {
      return res.status(403).json({ error: "Film erişim yetkiniz yok" })
    }

    const { page = 1, search } = req.query

    let endpoint = "/movie/popular"
    const params = { page }

    if (search) {
      endpoint = "/search/movie"
      params.query = search
    }

    const data = await tmdbRequest(endpoint, params)

    const movies = data.results.slice(0, 100).map((movie) => ({
      ...movie,
      user_rating: userRatings[`${req.user.id}_${movie.id}`] || null,
      user_note: userNotes[`${req.user.id}_${movie.id}`] || null,
    }))

    res.json({
      ...data,
      results: movies,
    })
  } catch (error) {
    res.status(500).json({ error: "Filmler yüklenirken hata oluştu" })
  }
})

// Film detaylarını getir
app.get("/api/movies/:id", authenticateToken, async (req, res) => {
  try {
    if (!req.user.permissions.includes("movies")) {
      return res.status(403).json({ error: "Film erişim yetkiniz yok" })
    }

    const movieId = req.params.id
    const movie = await tmdbRequest(`/movie/${movieId}`)

    const userRating = userRatings[`${req.user.id}_${movieId}`]
    const userNote = userNotes[`${req.user.id}_${movieId}`]

    const allRatings = Object.keys(userRatings)
      .filter((key) => key.endsWith(`_${movieId}`))
      .map((key) => userRatings[key])
      .filter((rating) => rating !== null)

    const averageRating =
      allRatings.length > 0 ? allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length : null

    res.json({
      ...movie,
      average_rating: averageRating,
      user_rating: userRating,
      user_note: userNote,
    })
  } catch (error) {
    res.status(500).json({ error: "Film detayları yüklenirken hata oluştu" })
  }
})

// Film puanı ve notu ekle/güncelle
app.post("/api/movies/:id/rate", authenticateToken, (req, res) => {
  try {
    if (!req.user.permissions.includes("movies")) {
      return res.status(403).json({ error: "Film erişim yetkiniz yok" })
    }

    const movieId = req.params.id
    const { rating, note } = req.body

    if (rating && (rating < 1 || rating > 10 || !Number.isInteger(rating))) {
      return res.status(400).json({ error: "Puan 1-10 arası tam sayı olmalıdır" })
    }

    const key = `${req.user.id}_${movieId}`

    if (rating) {
      userRatings[key] = rating
    }

    if (note !== undefined) {
      userNotes[key] = note
    }

    res.json({
      message: "Puan ve not başarıyla kaydedildi",
      rating: userRatings[key],
      note: userNotes[key],
    })
  } catch (error) {
    res.status(500).json({ error: "Puan kaydedilirken hata oluştu" })
  }
})

// Popüler oyuncuları getir
app.get("/api/actors/popular", authenticateToken, async (req, res) => {
  try {
    if (!req.user.permissions.includes("actors")) {
      return res.status(403).json({ error: "Oyuncu erişim yetkiniz yok" })
    }

    const { page = 1, search } = req.query

    let endpoint = "/person/popular"
    const params = { page }

    if (search) {
      endpoint = "/search/person"
      params.query = search
    }

    const data = await tmdbRequest(endpoint, params)
    const actors = data.results.slice(0, 100)

    res.json({
      ...data,
      results: actors,
    })
  } catch (error) {
    res.status(500).json({ error: "Oyuncular yüklenirken hata oluştu" })
  }
})

// Film önerisi
app.post("/api/movies/recommend", authenticateToken, async (req, res) => {
  try {
    const { query } = req.body

    if (!query) {
      return res.status(400).json({ error: "Arama terimi gerekli" })
    }

    const data = await tmdbRequest("/search/movie", { query })

    res.json({
      message: "Film önerisi işlendi",
      suggestions: data.results.slice(0, 10),
    })
  } catch (error) {
    res.status(500).json({ error: "Film önerisi alınırken hata oluştu" })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT} portunda çalışıyor`)
  console.log(`📱 Test: http://localhost:${PORT}/api/test`)
})
