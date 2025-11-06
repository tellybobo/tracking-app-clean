
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


  gsap.registerPlugin(ScrollTrigger);
  const countElement = document.querySelectorAll(".count-numbers");
  countElement.forEach((element) => {
    const targetValue = parseInt(element.getAttribute('data-target'));
   gsap.fromTo(element, 
  { textContent: 0 },
  {
    textContent: targetValue,
    ease: "none",
    snap: { textContent: 1 },
    duration: 4,
    scrollTrigger: {
      trigger: element.closest('.numbers-count'),
      start: "top 80%",
      end: "bottom 20%",
      scrub: true,
    }
  }
);
  });

  document.addEventListener('DOMContentLoaded', function() {
    const teamMembers = document.querySelectorAll('.team-member');
    let isMobile = window.innerWidth <= 767;
    let currentIndex = 0;
    let rotationInterval;

    // Desktop positions (transform values)
    const desktopPositions = [-400, -170, 170, 400];
    
    function initCarousel() {
        clearInterval(rotationInterval);
        isMobile = window.innerWidth <= 767;
        
        if (isMobile) {
            initMobileCarousel();
        } else {
            initDesktopCarousel();
        }
    }
    
    function initDesktopCarousel() {
        // Reset all team members for desktop
        teamMembers.forEach((member, index) => {
            member.style.opacity = '1';
            member.style.visibility = 'visible';
            member.style.transform = `translateX(${desktopPositions[index]}px)`;
        });
        
        function rotateDesktop() {
            // Move first position to the end
            const firstPosition = desktopPositions.shift();
            desktopPositions.push(firstPosition);
            
            // Apply new positions
            teamMembers.forEach((member, index) => {
                member.style.transform = `translateX(${desktopPositions[index]}px)`;
            });
        }
        
        rotationInterval = setInterval(rotateDesktop, 3000);
    }
    
    function initMobileCarousel() {
        currentIndex = 0;
        
        // Set initial state for mobile - only show first image
        teamMembers.forEach((member, index) => {
            member.style.transform = 'translateX(-50%)';
            if (index === 0) {
                member.style.opacity = '1';
                member.style.visibility = 'visible';
            } else {
                member.style.opacity = '0';
                member.style.visibility = 'hidden';
            }
        });
        
        function rotateMobile() {
            // Hide current image
            teamMembers[currentIndex].style.opacity = '0';
            teamMembers[currentIndex].style.visibility = 'hidden';
            
            // Move to next image
            currentIndex = (currentIndex + 1) % teamMembers.length;
            
            // Show next image
            teamMembers[currentIndex].style.opacity = '1';
            teamMembers[currentIndex].style.visibility = 'visible';
        }
        
        rotationInterval = setInterval(rotateMobile, 3000);
    }
    
    // Initialize
    initCarousel();
    
    // Reinitialize on resize
    window.addEventListener('resize', function() {
        const newIsMobile = window.innerWidth <= 767;
        if (newIsMobile !== isMobile) {
            initCarousel();
        }
    });
});


document.addEventListener('DOMContentLoaded', function() {
  const track = document.querySelector('.testimonies-track');
  const slides = document.querySelectorAll('.testimonies-slide');
  const dots = document.querySelectorAll('.testimonial-dot');
  let currentSlide = 0;

  function updateCarousel() {
   
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[currentSlide]) {
      dots[currentSlide].classList.add('active');
    }
  }


  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlide = index;
      updateCarousel();
    });
  });

 
  function startAutoSlide() {
    setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      updateCarousel();
    }, 5000);
  }

 
  startAutoSlide();

  window.addEventListener('resize', updateCarousel);
  
  updateCarousel();
});