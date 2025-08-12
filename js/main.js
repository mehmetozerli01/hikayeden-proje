// js/main.js
import { createMovieCard } from './movieCard.js';

const MOVIES_URL = 'https://raw.githubusercontent.com/prust/wikipedia-movie-data/refs/heads/master/movies-2020s.json';
// Eğer fetch CORS hatası verirse: '../data/movies-2020s.json' (local kopya) kullan.

function getId(movie) {
  return movie.href || movie.title;
}

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
  } catch {
    return [];
  }
}
function setFavorites(arr) {
  localStorage.setItem('favorites', JSON.stringify(arr));
}
function isFavorited(id) {
  return getFavorites().includes(id);
}
function toggleFavorite(id) {
  const favs = getFavorites();
  const idx = favs.indexOf(id);
  if (idx === -1) favs.push(id);
  else favs.splice(idx, 1);
  setFavorites(favs);
  return favs.includes(id);
}

async function fetchMovies() {
  const res = await fetch(MOVIES_URL);
  if (!res.ok) throw new Error('Veri çekilemedi: ' + res.status);
  return res.json();
}

// Render fonksiyonu
function renderMovies(movies) {
  const container = document.getElementById('movie-list');
  container.innerHTML = '';
  const favs = getFavorites();
  movies.forEach(movie => {
    const id = getId(movie);
    const cardHtml = createMovieCard(movie, id, favs.includes(id));
    container.insertAdjacentHTML('beforeend', cardHtml);
  });
}

// Event delegation: detay ve favori butonlarını yönet
function setupEvents() {
  const container = document.getElementById('movie-list');
  container.addEventListener('click', (e) => {
    const favBtn = e.target.closest('.btn-fav');
    if (favBtn) {
      const card = favBtn.closest('.movie-card');
      const id = card.dataset.movieId;
      const nowFavorited = toggleFavorite(id);
      // sadece tıklanan butonu güncelle (performans için)
      favBtn.classList.toggle('favorited', nowFavorited);
      favBtn.textContent = nowFavorited ? '♥ Favorilerden Kaldır' : '♡ Favorilere Ekle';
      return;
    }

    const detailBtn = e.target.closest('.btn-detail');
    if (detailBtn) {
      const card = detailBtn.closest('.movie-card');
      const id = card.dataset.movieId;
      // Wikipedia slug'ına yönlendir
      const wikiUrl = 'https://en.wikipedia.org/wiki/' + encodeURIComponent(id);
      window.open(wikiUrl, '_blank');
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  setupEvents();
  try {
    const movies = await fetchMovies();
    // büyük JSON -> başlangıçta ilk 50 filmi göster (isteğe göre artır)
    renderMovies(movies.slice(0, 50));
  } catch (err) {
    console.error(err);
    document.getElementById('movie-list').innerHTML = '<p>Filmler yüklenemedi. Konsolu kontrol et.</p>';
  }
});

import { loadNavbar } from "./components.js";

document.addEventListener("DOMContentLoaded", () => {
  loadNavbar();
});


