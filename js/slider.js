const slider = document.getElementById("movieSlider");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const apiUrl = "https://raw.githubusercontent.com/prust/wikipedia-movie-data/refs/heads/master/movies-2020s.json";

// Filmleri yükle
async function loadMovies() {
  try {
    const res = await fetch(apiUrl);
    const data = await res.json();

    // İlk 15 filmi gösterelim
    const movies = data.slice(0, 15);

    movies.forEach(movie => {
      const card = document.createElement("div");
      card.classList.add("movie-card");

      card.innerHTML = `
        <img src="${movie.thumbnail || 'https://via.placeholder.com/200x300?text=No+Image'}" alt="${movie.title}">
        <h4 style="color:#fff; padding:5px; font-size:14px">${movie.title}</h4>
      `;

      slider.appendChild(card);
    });
  } catch (err) {
    console.error("Film verileri alınamadı:", err);
  }
}

loadMovies();

// Kaydırma butonları
nextBtn.addEventListener("click", () => {
  slider.scrollBy({ left: 400, behavior: "smooth" });
});

prevBtn.addEventListener("click", () => {
  slider.scrollBy({ left: -400, behavior: "smooth" });
});
