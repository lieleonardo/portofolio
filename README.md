# 🚀 Portfolio — React + GitHub Pages

Dark mode minimalist portfolio for React Native & React JS developer.

## ✅ Setup

```bash
npm install
npm start
```

## 🌐 Deploy ke GitHub Pages

### 1. Edit `package.json`
Ganti `homepage` dengan username GitHub kamu:
```json
"homepage": "https://YOURUSERNAME.github.io/portfolio"
```

### 2. Install gh-pages
```bash
npm install
```

### 3. Push ke GitHub
```bash
git init
git add .
git commit -m "init portfolio"
git branch -M main
git remote add origin https://github.com/YOURUSERNAME/portfolio.git
git push -u origin main
```

### 4. Deploy
```bash
npm run deploy
```

Selesai! Portofolio live di: `https://YOURUSERNAME.github.io/portfolio`

---

## ✏️ Cara Kustomisasi

Edit file `src/App.js`:

- **Nama** → cari `Your Name Here`
- **Deskripsi hero** → ubah teks di bagian `hero-desc`
- **Projects** → edit array `projects`
- **Experience** → edit array `experiences`
- **Skills** → edit array `skills`
- **Kontak** → ubah email, LinkedIn, GitHub di bagian Contact
- **Stats** → edit array di bagian About (tahun, jumlah project, dll)

## 🎨 Warna Accent

Di bagian `:root` dalam styles:
```css
--accent: #00ff87;   /* Ganti warna ini */
```
