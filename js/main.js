// js/main.js
import { createMovieCard } from './movieCard.js';
import { loadNavbar } from "./components.js";

const MOVIES_URL = 'https://raw.githubusercontent.com/prust/wikipedia-movie-data/refs/heads/master/movies-2020s.json';
// Eğer fetch CORS hatası verirse: '../data/movies-2020s.json' (local kopya) kullan.

let allMovies = []; // tüm filmleri globalde saklayacağız

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
      favBtn.classList.toggle('favorited', nowFavorited);
      favBtn.textContent = nowFavorited ? '♥ Favorilerden Kaldır' : '♡ Favorilere Ekle';
      return;
    }

    const detailBtn = e.target.closest('.btn-detail');
    if (detailBtn) {
      const card = detailBtn.closest('.movie-card');
      const id = card.dataset.movieId;
      const wikiUrl = 'https://en.wikipedia.org/wiki/' + encodeURIComponent(id);
      window.open(wikiUrl, '_blank');
      return;
    }

    const reviewBtn = e.target.closest('.btn-review');
    if (reviewBtn) {
      const card = reviewBtn.closest('.movie-card');
      const movieId = card.dataset.movieId;
      openModal(card, movieId);
    }
  });

  // 🔎 Arama kutusu olayı
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      const filtered = allMovies.filter(m => m.title.toLowerCase().includes(query));
      renderMovies(filtered.slice(0, 50)); // ilk 50 tanesi
    });
  }
}

function openModal(card, movieId) {
  const modal = document.getElementById('movie-modal');
  const modalBody = document.getElementById('modal-body');

  const title = card.querySelector('.movie-title').innerText;
  const poster = card.querySelector('.movie-poster').src;
  const genres = card.querySelector('.movie-genres').innerText;
  const cast = card.querySelector('.movie-cast').innerText;
  const desc = card.querySelector('.movie-desc').innerText;

  modalBody.innerHTML = `
    <div class="modal-movie">
      <img src="${poster}" alt="${title}" style="width:200px; float:left; margin-right:20px;">
      <div>
        <h2>${title}</h2>
        <p><strong>Türler:</strong> ${genres}</p>
        <p>${cast}</p>
        <p>${desc}</p>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');

  const closeBtn = modal.querySelector('.modal-close');
  closeBtn.onclick = () => modal.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', async () => {
  loadNavbar();
  setupEvents();
  try {
    allMovies = await fetchMovies();
    renderMovies(allMovies.slice(0, 50));
  } catch (err) {
    console.error(err);
    document.getElementById('movie-list').innerHTML = '<p>Filmler yüklenemedi. Konsolu kontrol et.</p>';
  }
});
