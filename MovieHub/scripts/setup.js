const fs = require("fs")
const path = require("path")

console.log("🔧 Film uygulaması kurulumu başlıyor...")

// Gerekli klasörleri oluştur
const dirs = ["server", "client/src/components", "client/src/contexts", "client/public"]

dirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
    console.log(`✅ Klasör oluşturuldu: ${dir}`)
  }
})

// client/public/index.html oluştur
const indexHtml = `<!DOCTYPE html>
<html lang="tr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#ff6b35" />
    <meta name="description" content="Film Uygulaması - TheMovieDB API ile film ve oyuncu bilgileri" />
    <title>🎬 Film Uygulaması</title>
    <style>
      body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        background-color: #1a1a1a;
        color: #ffffff;
      }
      .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        font-size: 18px;
        color: #ff6b35;
      }
    </style>
  </head>
  <body>
    <noscript>Bu uygulamayı çalıştırmak için JavaScript gerekli.</noscript>
    <div id="root">
      <div class="loading">🎬 Film uygulaması yükleniyor...</div>
    </div>
  </body>
</html>`

fs.writeFileSync("client/public/index.html", indexHtml)
console.log("✅ client/public/index.html oluşturuldu")

// .env dosyası oluştur
const envContent = `PORT=5000
JWT_SECRET=film-app-super-secret-key-2024
NODE_ENV=development
TMDB_API_KEY=ff9a64c2a4e735039a74fef7ae6bc762
TMDB_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZjlhNjRjMmE0ZTczNTAzOWE3NGZlZjdhZTZiYzc2MiIsIm5iZiI6MTc1MTEyMTQ2MC40NDEsInN1YiI6IjY4NWZmZTM0ODQ4ZDU5ODcxYjBkOGU1NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.c1hds17XF2zDoSwUyx8I65JoVtdlUXOD6QL4CKQPPjc`

fs.writeFileSync(".env", envContent)
console.log("✅ .env dosyası oluşturuldu")

console.log("\n🎉 Kurulum tamamlandı!")
console.log("\n📋 Sonraki adımlar:")
console.log("1. npm install")
console.log("2. cd client && npx create-react-app . --template typescript")
console.log("3. cd .. && npm run dev")
console.log("\n🔑 Test kullanıcıları:")
console.log("- admin / admin123 (Tüm yetkiler)")
console.log("- movieuser / movie123 (Sadece filmler)")
console.log("- actoruser / actor123 (Sadece oyuncular)")
