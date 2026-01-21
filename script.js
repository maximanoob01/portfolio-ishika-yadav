document.addEventListener("DOMContentLoaded", () => {
  
  /* =========================================================
     1. Theme Toggle (Dark/Light Mode)
     ========================================================= */
  const html = document.documentElement;
  const themeBtn = document.getElementById("themeToggle");
  const themeIcon = themeBtn ? themeBtn.querySelector("i") : null;

  // 1. Check LocalStorage or System Preference
  const currentTheme = localStorage.getItem("theme") || 
                       (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  
  // 2. Apply Theme Immediately
  html.setAttribute("data-theme", currentTheme);
  updateThemeIcon(currentTheme);

  // 3. Toggle Event Listener
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const existingTheme = html.getAttribute("data-theme");
      const newTheme = existingTheme === "light" ? "dark" : "light";
      
      html.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    // Remove both specific icon classes to reset
    themeIcon.classList.remove("ph-moon", "ph-sun");
    
    // Add the correct icon based on theme
    if (theme === "dark") {
      themeIcon.classList.add("ph-sun"); // Show Sun icon in Dark mode
    } else {
      themeIcon.classList.add("ph-moon"); // Show Moon icon in Light mode
    }
  }

  /* =========================================================
     2. Mobile Menu Handling
     ========================================================= */
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const menuIcon = menuToggle ? menuToggle.querySelector("i") : null;

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");
      
      // Update Icon
      if (menuIcon) {
        menuIcon.classList.remove(isOpen ? "ph-list" : "ph-x");
        menuIcon.classList.add(isOpen ? "ph-x" : "ph-list");
      }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("is-open");
        if (menuIcon) {
            menuIcon.classList.remove("ph-x");
            menuIcon.classList.add("ph-list");
        }
      });
    });
  }

  /* =========================================================
     3. Scroll Progress Bar
     ========================================================= */
  const progressBar = document.getElementById("progressBar");
  
  if (progressBar) {
      window.addEventListener("scroll", () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = scrolled + "%";
      });
  }

  /* =========================================================
     4. Number Counters (Animated)
     ========================================================= */
  const counters = document.querySelectorAll(".counter");
  const speed = 200; // Lower is slower

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.innerText.replace(/k\+|%|\+/g, '') || +counter.getAttribute('data-target') || 0; // Handle text or attribute
        
        // Reset to 0 before animating
        counter.innerText = "0";

        const updateCount = () => {
            const current = +counter.innerText.replace(/k\+|%|\+/g, ''); // strip symbols for math
            const increment = target / speed;

            if (current < target) {
                // Determine format (k+, %, or plain) based on context or manual check
                let nextVal = Math.ceil(current + increment);
                if(nextVal > target) nextVal = target;
                
                // Add suffix formatting back
                if (counter.parentElement.innerHTML.includes("Impressions")) {
                    counter.innerText = nextVal; // We add 'k+' at the end
                } else {
                    counter.innerText = nextVal;
                }
                
                setTimeout(updateCount, 20);
            } else {
                // Final Formatting
                if (target >= 1000) {
                    counter.innerText = (target / 1000).toFixed(0) + "k+"; // Example: 250k+
                } else if (counter.parentElement.innerHTML.includes("Growth") || counter.parentElement.innerHTML.includes("Rate")) {
                    counter.innerText = target + "%";
                } else {
                    counter.innerText = target + "+";
                }
            }
        };
        updateCount();
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => {
      // Store original text as target if data-target is missing
      if (!counter.getAttribute('data-target')) {
          counter.setAttribute('data-target', counter.innerText.replace(/\D/g,'')); 
      }
      counterObserver.observe(counter);
  });

  /* =========================================================
     5. Fade-In Animation on Scroll
     ========================================================= */
  const faders = document.querySelectorAll(".fade-in");
  
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        fadeObserver.unobserve(entry.target); // Only animate once
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  faders.forEach(fader => fadeObserver.observe(fader));

  /* =========================================================
     6. Custom Cursor Halo (Desktop Only)
     ========================================================= */
  const cursor = document.querySelector(".cursor-halo");
  
  // Only activate if device has a mouse (not touch)
  if (cursor && window.matchMedia("(pointer: fine)").matches) {
    
    document.addEventListener("mousemove", (e) => {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
    });

    // Add hover effect to clickable elements
    const hoverTargets = document.querySelectorAll("a, button, input, textarea, .project-card, .exp-card");
    
    hoverTargets.forEach(el => {
        el.addEventListener("mouseenter", () => cursor.classList.add("hovered"));
        el.addEventListener("mouseleave", () => cursor.classList.remove("hovered"));
    });
  }

  /* =========================================================
     7. Form Submission Handling (Optional UX improvement)
     ========================================================= */
  const form = document.querySelector(".contact-form");
  if (form) {
      form.addEventListener("submit", function(e) {
          // Note: Formspree handles the actual submission. 
          // This just adds a visual cue while redirecting.
          const btn = form.querySelector("button");
          btn.innerHTML = "<i class='ph ph-spinner ph-spin'></i> Sending...";
          btn.style.opacity = "0.7";
      });
  }
});