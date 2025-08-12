export async function loadNavbar() {

    const res =await fetch("./components/navbar.html");
    const html=await res.text();
    document.querySelector("header").innerHTML=html;
}

