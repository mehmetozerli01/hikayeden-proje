export async function loadNavbar() {

    const res =await fetch("./components/navbar.html");
    const html=await res.text();
    document.querySelector("header").innerHTML=html;
}

document.addEventListener("DOMContentLoaded" , () => {
    const drawer = document.getElementById("drawer");
    const overlay= document.getElementById("overlay");
    const drawerBtn=document.getElementById("drawerBtn");
    const closeDrawer=document.getElementById("closeDrawer");

    if (drawerBtn) {
        drawerBtn.addEventListener("click", () =>  {
            drawer.classList.add("open");
            overlay.classList.add("show");
        });

    }

    if (closeDrawer) {
        closeDrawer.addEventListener("click", () => {
            drawer.classList.remove("open");
            overlay.classList.remove("show");

        });
    }
    
    if (overlay) {
        overlay.addEventListener("click",() => {
            drawer.classList.remove("open");
            overlay.classList.remove("show");
        });
    }

}); 

    
