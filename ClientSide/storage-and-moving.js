document.addEventListener('DOMContentLoaded', function() {
  
  const mobileNavbar = document.getElementById("mobile-navbar");
  if (mobileNavbar) {
    mobileNavbar.classList.remove("active");
  }
 
  const submenu = document.getElementById("services-submenu");
  if (submenu) {
    submenu.classList.remove("active");
  }
  
  console.log("Navbar reset - mobile navbar active:", mobileNavbar?.classList.contains("active"));
  console.log("Submenu reset - submenu active:", submenu?.classList.contains("active"));
});