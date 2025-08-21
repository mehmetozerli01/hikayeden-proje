document.addEventListener("DOMContentLoaded", () => {
  const drawer = document.getElementById("drawer");
  const toggleBtn = document.getElementById("toggleDrawer");

  toggleBtn.addEventListener("click", () => {
    drawer.classList.toggle("open");

    if (drawer.classList.contains("open")) {
      toggleBtn.textContent = "×"; // Menü açıldıysa buton "×"
    } else {
      toggleBtn.textContent = "☰ Menü"; // Menü kapalıysa buton "☰ Menü"
    }
  });

  // Drawer dışına tıklayınca kapatma
  document.addEventListener("click", (e) => {
    if (drawer.classList.contains("open") && 
        !drawer.contains(e.target) && 
        !toggleBtn.contains(e.target)) {
      drawer.classList.remove("open");
      toggleBtn.textContent = "☰ Menü"; // Dışarıya tıklayınca geri menü yazsın
    }
  });
});
