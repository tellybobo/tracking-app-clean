class ProfessionalSlider {
    constructor() {
        this.sliderTrack = document.querySelector('.slider-track');
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.dot');
        this.prevArrow = document.querySelector('.prev-arrow');
        this.nextArrow = document.querySelector('.next-arrow');
        
        this.currentSlide = 0;
        this.slideInterval = null;
        this.slideDuration = 5000; 
        this.isTransitioning = false;
        
        this.init();
    }
    
    init() {
        
        this.updateSlider();
        
     
        this.startAutoSlide();
        
      
        this.dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                if (this.isTransitioning) return;
                const slideIndex = parseInt(e.target.getAttribute('data-slide'));
                this.goToSlide(slideIndex);
            });
        });
        
        
        this.prevArrow.addEventListener('click', () => {
            if (this.isTransitioning) return;
            this.prevSlide();
        });
        
        this.nextArrow.addEventListener('click', () => {
            if (this.isTransitioning) return;
            this.nextSlide();
        });
        
        this.sliderTrack.addEventListener('transitionend', () => {
            this.isTransitioning = false;
        });
    }
    
    goToSlide(slideIndex) {
        if (this.isTransitioning || slideIndex === this.currentSlide) return;
        
        this.isTransitioning = true;
        this.currentSlide = slideIndex;
        this.updateSlider();
        this.resetAutoSlide();
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }
    
    updateSlider() {
       
        this.sliderTrack.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        
        
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });
        
       
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    startAutoSlide() {
        this.stopAutoSlide();
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, this.slideDuration);
    }
    
    stopAutoSlide() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }
    
    resetAutoSlide() {
        this.stopAutoSlide();
        this.startAutoSlide();
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new ProfessionalSlider();
});

const sliderNavbar = document.querySelector('.slider-internal-navbar');
const sliderContainer = document.querySelector('.slider-container');

sliderContainer.addEventListener('scroll', function() {
    if (sliderContainer.scrollTop > 50) {
        sliderNavbar.style.background = 'rgba(0, 0, 0, 0.8)';
        sliderNavbar.style.backdropFilter = 'blur(20px)';
    } else {
        sliderNavbar.style.background = 'rgba(0, 0, 0, 0.4)';
        sliderNavbar.style.backdropFilter = 'blur(15px)';
    }
});

  function toggleNavbar() {
    document.getElementById("mobile-navbar").classList.toggle("active");
  }

 function toggleSubmenu() {
    const submenu = document.getElementById("services-submenu");
    submenu.classList.toggle("active");
  }

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