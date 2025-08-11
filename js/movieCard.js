// js/movieCard.js
export function createMovieCard(movie, id, isFavorited = false) {
  // id: movie.href || movie.title
  return `
  <div class="movie-card" data-movie-id="${id}">
    <img class="movie-poster" src="${movie.thumbnail || '../assets/images/fallback.png'}" alt="${escapeHtml(movie.title)} Poster" loading="lazy">
    <div class="movie-info">
      <h3 class="movie-title">${escapeHtml(movie.title)} <small>(${movie.year || ''})</small></h3>
      <p class="movie-genres">${(movie.genres || []).map(g => escapeHtml(g)).join(', ')}</p>
      <p class="movie-cast"><strong>Cast:</strong> ${(movie.cast || []).map(c => escapeHtml(c)).join(', ')}</p>
      <p class="movie-desc">${escapeHtml((movie.extract || '').slice(0, 200))}${(movie.extract || '').length > 200 ? '…' : ''}</p>
      <div class="movie-actions">
        <button class="btn btn-detail">Detay</button>
        <button class="btn btn-fav ${isFavorited ? 'favorited' : ''}">
          ${isFavorited ? '♥ Favorilerden Kaldır' : '♡ Favorilere Ekle'}
        </button>
      </div>
    </div>
  </div>
  `;
}

// Basit HTML escape (XSS koruması için asgari)
function escapeHtml(str) {
  return String(str || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
