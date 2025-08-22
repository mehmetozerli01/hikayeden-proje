document.addEventListener("DOMContentLoaded", ()=> {
    const footerContainer= document.getElementById("footer");

    fetch("components/footer.html")
    .then(res=> res.text())
    .then(data => {
        footerContainer.innerHTML=data;

        const yearSpan=document.getElementById("year");
        if(yearSpan) {

            yearSpan.textContent=new Date().getFullYear();
        }

    })
    
    .catch(err=> console.error("Footer yüklenemedi:", err));

});



