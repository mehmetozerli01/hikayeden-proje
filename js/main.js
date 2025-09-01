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
    renderMovies(allMovies.slice(0, 50));  // başlangıçta ilk 50 filmi göster isteğe bağlı arttır
  } catch (err) {
    console.error(err);
    document.getElementById('movie-list').innerHTML = '<p>Filmler yüklenemedi. Konsolu kontrol et.</p>';
  }
});


export async function loadChatbox() {
  const res = await fetch("./components/chatbox.html");
  const html = await res.text();
  document.body.insertAdjacentHTML("beforeend", html);

  const chatbox = document.querySelector(".chatbox");
  const chatOpen = document.getElementById("chatOpen");
  const chatClose = document.getElementById("chatClose");
  const chatSend = document.getElementById("chatSend");
  const chatInput = document.getElementById("chatInput");
  const chatBody = document.getElementById("chatBody");

  // Açma kapama
  chatOpen.addEventListener("click", () => chatbox.style.display = "flex");
  chatClose.addEventListener("click", () => chatbox.style.display = "none");

  // Mesaj gönderme
  chatSend.addEventListener("click", () => {
    const text = chatInput.value.trim();
    if (!text) return;

    // Kullanıcı mesajı
    chatBody.innerHTML += `<div class="msg user">${text}</div>`;
    chatInput.value = "";
    chatBody.scrollTop = chatBody.scrollHeight;

    // Basit bot cevabı
    setTimeout(() => {
      let reply = "Bunu anlayamadım 🤔";

      if (text.toLowerCase().includes("merhaba")) reply = "Merhaba! 👋 Hoş geldiniz. Film aramak ister misiniz?";
if (text.toLowerCase().includes("selam")) reply = "Selam! 🎬 Film keyfi yapmaya hazır mısınız?";
if (text.toLowerCase().includes("film")) reply = "Hangi filmi arıyorsunuz? 🎥";
if (text.toLowerCase().includes("yardım")) reply = "Size yardımcı olmak için buradayım! 😊 Bana 'film öner' veya 'popüler filmler' yazabilirsiniz.";

// Türlere göre
if (text.toLowerCase().includes("aksiyon")) reply = "Aksiyon filmlerinden bazıları: John Wick, Mad Max, Extraction.";
if (text.toLowerCase().includes("komedi")) reply = "Komedi keyfi için: The Mask, Hangover, Mr. Bean. 😂";
if (text.toLowerCase().includes("dram")) reply = "Dram türünde önerilerim: The Pursuit of Happyness, Green Mile.";
if (text.toLowerCase().includes("korku")) reply = "Korku mu istiyorsunuz? 🎃 Conjuring, Annabelle, IT iyi seçim olabilir.";
if (text.toLowerCase().includes("romantik")) reply = "Romantik filmler: Titanic, The Notebook, La La Land. 💕";
if (text.toLowerCase().includes("bilim kurgu") || text.toLowerCase().includes("sci-fi")) reply = "Bilim kurgu sevenlere: Interstellar, Inception, Dune.";
if (text.toLowerCase().includes("animasyon")) reply = "Animasyon filmler: Inside Out, Shrek, Frozen.";
if (text.toLowerCase().includes("belgesel")) reply = "Belgesel sevenler için: Our Planet, Making a Murderer, The Social Dilemma.";

// Popüler & trend
if (text.toLowerCase().includes("popüler")) reply = "Şu an popüler olan filmler: Oppenheimer, Barbie, Dune 2.";
if (text.toLowerCase().includes("trend")) reply = "Trendlerde şu an: Deadpool & Wolverine, Inside Out 2.";
if (text.toLowerCase().includes("yeni")) reply = "Son çıkan yeni filmler: Dune Part Two, Mission Impossible Dead Reckoning.";
if (text.toLowerCase().includes("vizyonda")) reply = "Şu an vizyonda olan filmleri görmek ister misiniz? 🍿";

// Öneri & tavsiye
if (text.toLowerCase().includes("öner")) reply = "Size uygun film önermem için tür söyler misiniz? (Aksiyon, Komedi, Dram...) 🎥";
if (text.toLowerCase().includes("izle")) reply = "Film izlemek için hemen arama kutusuna film adını yazabilirsiniz! 🔍";
if (text.toLowerCase().includes("favori")) reply = "Favori filmler listeniz mi var? 🌟 Onu görmek isterseniz kullanıcı panelinden bakabilirsiniz.";
if (text.toLowerCase().includes("rastgele")) reply = "Size rastgele bir film öneriyorum: Forrest Gump. 🎬";

// Yönetmen & oyuncu
if (text.toLowerCase().includes("nolan")) reply = "Christopher Nolan filmleri: Inception, Interstellar, Oppenheimer, The Dark Knight.";
if (text.toLowerCase().includes("tarantino")) reply = "Quentin Tarantino filmleri: Pulp Fiction, Kill Bill, Django Unchained.";
if (text.toLowerCase().includes("brad pitt")) reply = "Brad Pitt filmleri: Fight Club, Once Upon a Time in Hollywood, Troy.";
if (text.toLowerCase().includes("leonardo dicaprio")) reply = "Leonardo DiCaprio filmleri: Titanic, Inception, The Revenant.";

// Genel sorular
if (text.toLowerCase().includes("site")) reply = "Bu siteyle ilgili sorularınızı bana sorabilirsiniz. 🎬";
if (text.toLowerCase().includes("kayıt")) reply = "Film favorilerinizi kaydetmek için kayıt olabilirsiniz. 📌";
if (text.toLowerCase().includes("üye")) reply = "Üyelik tamamen ücretsizdir. Hemen kaydolabilirsiniz! ✅";
if (text.toLowerCase().includes("abonelik") || text.toLowerCase().includes("premium")) reply = "Premium üyelik ile reklamsız film keyfi yaşayabilirsiniz! ✨";

// Çıkış
if (text.toLowerCase().includes("çıkış") || text.toLowerCase().includes("bye") || text.toLowerCase().includes("görüşürüz")) 
    reply = "Görüşmek üzere! 👋 İyi seyirler dilerim.";
      chatBody.innerHTML += `<div class="msg bot">${reply}</div>`;
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 800);
  });
}

// Chatbox'u sayfa yüklenince çağır
document.addEventListener("DOMContentLoaded", () => {
  loadChatbox();
});


const top10List = document.getElementById('top10-list');

async function renderTop10() {
  const movies = await fetchMovies();
  const top10 = movies.slice(0, 10); // ilk 10 film

  top10.forEach((movie, index) => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    movieCard.innerHTML = `
      <div class="rank">${index + 1}</div>
      <img src="${movie.thumbnail}" alt="${movie.title}">
      <p class="movie-title">${movie.title}</p>
    `;
    top10List.appendChild(movieCard);
  });
}

renderTop10();
