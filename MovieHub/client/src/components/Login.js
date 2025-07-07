"use client"

import { useState, useEffect } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import "./Login.css"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showIntro, setShowIntro] = useState(true)

  const { user, login } = useAuth()

  


  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await login(username, password)

    if (!result.success) {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <>
      {showIntro && (
        <div className="intro-screen">
          <h1 className="logo-animation">ᗰOᐯIEᕼᑌᗷ</h1>
        </div>
      )}

      {!showIntro && (
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <h1>ᗰOᐯIEᕼᑌᗷ</h1>
              <p>TheMovieDB ile film ve oyuncu keşfet</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {error && <div className="error">{error}</div>}

              <div className="form-group">
                <label htmlFor="username">Kullanıcı Adı</label>
                <input
                  type="text"
                  id="username"
                  className="form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Kullanıcı adınızı girin"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Şifre</label>
                <input
                  type="password"
                  id="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Şifrenizi girin"
                />
              </div>

              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
              </button>
              <div className="social-login">
  <p>Sosyal Medya Hesabınla Giriş Yap</p>
  <button
  type="button"
  className="apple-btn"
  onClick={() => alert("Apple ile giriş henüz entegre edilmedi.")}
  disabled={loading}
>
  <img src="https://img.icons8.com/ios-filled/50/ffffff/mac-os.png" alt="Apple" />
  Apple ile Giriş Yap
</button>

  <button
  
  //google giriş
    type="button"
    className="google-btn"
    onClick={() => alert("Google girişi henüz entegre edilmedi.")}
    disabled={loading}
  >
    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
    Google ile Giriş Yap
  </button>
</div>

            </form>
          </div>
        </div>
      )}
    </>
  )
}


export default Login

