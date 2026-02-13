// CURTAIN ANIMATION
window.addEventListener('DOMContentLoaded', () => {
  const curtain = document.getElementById('curtain');
  if (curtain) {
    const left = curtain.querySelector('.left-panel');
    const right = curtain.querySelector('.right-panel');

    setTimeout(() => {
      left.classList.add('-translate-x-full');
      right.classList.add('translate-x-full');
    }, 100);

    setTimeout(() => {
      curtain.remove();
    }, 9000);
  }
});

// DARK MODE
const html = document.documentElement;

if (localStorage.getItem("theme") === "dark") {
  html.classList.add("dark");
}

document.addEventListener("click", (e) => {
  const toggle = e.target.closest("[data-theme-toggle]");
  if (!toggle) return;

  html.classList.toggle("dark");
  localStorage.setItem("theme", html.classList.contains("dark") ? "dark" : "light");
});

// AOS INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 900,
      easing: "ease-out-cubic",
      once: true,
    });
  }
});

// HAMBURGER MENU
const hamburgerBtn = document.getElementById("hamburgerBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (hamburgerBtn && mobileMenu) {
  hamburgerBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    hamburgerBtn.classList.toggle("open");
    mobileMenu.classList.toggle("-translate-y-full");
  });

  document.addEventListener("click", (e) => {
    if (!mobileMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
      mobileMenu.classList.add("-translate-y-full");
      hamburgerBtn.classList.remove("open");
    }
  });

  document.querySelectorAll(".mobile-link").forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("-translate-y-full");
      hamburgerBtn.classList.remove("open");
    });
  });
}

// TESTIMONIAL SLIDER
const track = document.getElementById("reviewTrack");

if (track) {
  track.innerHTML += track.innerHTML;

  let speed = 0.5;
  let isHover = false;

  track.parentElement.addEventListener("mouseenter", () => isHover = true);
  track.parentElement.addEventListener("mouseleave", () => isHover = false);

  function autoScroll() {
    if (!isHover) {
      track.parentElement.scrollLeft += speed;
      if (track.parentElement.scrollLeft >= track.scrollWidth / 2) {
        track.parentElement.scrollLeft = 0;
      }
    }
    requestAnimationFrame(autoScroll);
  }

  requestAnimationFrame(autoScroll);
}

// ==================== FIREBASE INTEGRATION ====================

// Initialize Firebase (only if not on admin pages)
if (typeof firebase !== 'undefined' && !window.location.pathname.includes('admin')) {
  
  if (typeof window.APP_CONFIG === 'undefined') {
    console.error('Config not loaded! Make sure config.js is loaded before main.js');
  } else {
    const firebaseConfig = window.APP_CONFIG.firebase;

    try {
      firebase.initializeApp(firebaseConfig);
      const db = firebase.database();
      console.log('Firebase initialized successfully!');

      // Determine which page we're on and load appropriate data
      const currentPath = window.location.pathname;

      // Load dynamic content on homepage
      if (currentPath.includes('index.html') || currentPath === '/' || currentPath.endsWith('/')) {
        loadLandingText(db);
        loadSelectedProjects(db);
        loadReviews(db);
      }

      // Load all projects on projects page
      if (currentPath.includes('projects.html')) {
        loadAllProjects(db);
      }

      // Load individual project on project detail page
      if (currentPath.includes('project-detail.html')) {
        loadProjectDetail(db);
      }

    } catch (error) {
      console.error('Firebase initialization error:', error);
    }

    // Load landing page text
    async function loadLandingText(db) {
      try {
        const snapshot = await db.ref('landingText').once('value');
        const data = snapshot.val();
        
        console.log('Landing text loaded:', data);
        
        if (data) {
          const heading = document.getElementById('heroHeading');
          const subtext = document.getElementById('heroSubtext');
          
          if (heading && data.heading) {
            heading.innerHTML = data.heading.replace(/\n/g, '<br>');
          }
          if (subtext && data.subtext) {
            subtext.textContent = data.subtext;
          }
        }
      } catch (error) {
        console.error('Error loading landing text:', error);
      }
    }

    // Load selected projects for homepage
    async function loadSelectedProjects(db) {
      const loadingEl = document.getElementById('projectsLoading');
      const container = document.getElementById('selectedProjectsContainer');
      const emptyEl = document.getElementById('projectsEmpty');

      try {
        const selectedSnapshot = await db.ref('selectedProjects').once('value');
        const selected = selectedSnapshot.val();
        
        console.log('Selected projects:', selected);
        
        if (!selected) {
          console.log('No selected projects found');
          if (loadingEl) loadingEl.classList.add('hidden');
          if (emptyEl) emptyEl.classList.remove('hidden');
          return;
        }

        const projectsSnapshot = await db.ref('projects').once('value');
        const projects = projectsSnapshot.val();
        
        console.log('All projects:', projects);
        
        if (!projects) {
          console.log('No projects found');
          if (loadingEl) loadingEl.classList.add('hidden');
          if (emptyEl) emptyEl.classList.remove('hidden');
          return;
        }

        if (!container) {
          console.log('Container not found');
          return;
        }

        // Hide loading, show container
        if (loadingEl) loadingEl.classList.add('hidden');
        container.classList.remove('hidden');
        container.innerHTML = '';

        const selectedProjects = [selected.slot1, selected.slot2, selected.slot3].filter(id => id && projects[id]);
        
        if (selectedProjects.length === 0) {
          container.classList.add('hidden');
          if (emptyEl) emptyEl.classList.remove('hidden');
          return;
        }

        selectedProjects.forEach((projectId, index) => {
          const project = projects[projectId];
          const card = document.createElement('div');
          card.setAttribute('data-aos', 'fade-up');
          card.setAttribute('data-aos-delay', index * 100);
          
          card.innerHTML = `
            <img src="${project.heroImage || 'assets/images/hero.jpg'}" alt="${project.title}" class="mb-4 w-full h-64 object-cover transform transition-transform duration-300 hover:-translate-y-3 rounded">
            <h3 class="mb-10 text-xl md:text-xl">${project.title}</h3>
            <a href="project-detail.html?id=${projectId}" class="px-6 py-3 bg-black text-white text-lg hover:bg-gray-800 transition md:text-xl dark:text-black dark:bg-white inline-block">View Project</a>
          `;
          
          container.appendChild(card);
        });
        
        console.log('Projects loaded successfully!');
        
        // Refresh AOS
        if (typeof AOS !== 'undefined') {
          AOS.refresh();
        }
      } catch (error) {
        console.error('Error loading selected projects:', error);
        if (loadingEl) loadingEl.classList.add('hidden');
        if (emptyEl) emptyEl.classList.remove('hidden');
      }
    }

    // Load reviews
    async function loadReviews(db) {
      try {
        const snapshot = await db.ref('reviews').once('value');
        const reviews = snapshot.val();
        
        console.log('Reviews loaded:', reviews);
        
        if (!reviews) {
          console.log('No reviews found');
          return;
        }

        const track = document.getElementById('reviewTrack');
        if (!track) {
          console.log('Review track not found');
          return;
        }

        track.innerHTML = '';

        Object.values(reviews).forEach(review => {
          const card = document.createElement('div');
          card.className = 'review-card border rounded-lg p-5 border-black/10 bg-gray-300 dark:border-white/10 dark:bg-white/5';
          card.innerHTML = `
            <p class="text-sm opacity-80">"${review.text}"</p>
            <div class="mt-4 font-semibold">— ${review.name}</div>
          `;
          track.appendChild(card);
        });

        // Duplicate for infinite scroll
        track.innerHTML += track.innerHTML;
        
        console.log('Reviews loaded successfully!');
      } catch (error) {
        console.error('Error loading reviews:', error);
      }
    }

    // ==================== PROJECTS PAGE ====================
    // Load all projects on projects.html page
    async function loadAllProjects(db) {
      const loadingEl = document.getElementById('loadingState');
      const container = document.getElementById('projectsContainer');
      const emptyEl = document.getElementById('emptyState');

      try {
        const snapshot = await db.ref('projects').once('value');
        const projects = snapshot.val();

        if (!projects || Object.keys(projects).length === 0) {
          console.log('No projects found');
          if (loadingEl) loadingEl.classList.add('hidden');
          if (emptyEl) emptyEl.classList.remove('hidden');
          return;
        }

        console.log('All projects loaded:', projects);

        // Hide loading, show container
        if (loadingEl) loadingEl.classList.add('hidden');
        if (container) {
          container.classList.remove('hidden');
          container.innerHTML = '';

          // Create card for each project
          Object.keys(projects).forEach((projectId, index) => {
            const project = projects[projectId];
            
            const card = document.createElement('div');
            card.setAttribute('data-aos', 'fade-up');
            card.setAttribute('data-aos-delay', (index % 3) * 100);
            
            card.innerHTML = `
              <a href="project-detail.html?id=${projectId}" class="block group">
                <div class="overflow-hidden rounded-lg mb-4">
                  <img 
                    src="${project.heroImage || 'assets/images/hero.jpg'}" 
                    alt="${project.title}" 
                    class="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
                  >
                </div>
                <h3 class="text-xl font-heading mb-2 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition">${project.title}</h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">${project.description}</p>
              </a>
            `;
            
            container.appendChild(card);
          });

          // Refresh AOS
          if (typeof AOS !== 'undefined') {
            AOS.refresh();
          }
        }
      } catch (error) {
        console.error('Error loading all projects:', error);
        if (loadingEl) loadingEl.classList.add('hidden');
        if (emptyEl) emptyEl.classList.remove('hidden');
      }
    }

    // ==================== PROJECT DETAIL PAGE ====================
    // Load individual project on project-detail.html page
    function getProjectIdFromURL() {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('id');
    }

    async function loadProjectDetail(db) {
      const projectId = getProjectIdFromURL();
      const loadingEl = document.getElementById('loadingState');
      const contentEl = document.getElementById('projectContent');
      const errorEl = document.getElementById('errorState');

      if (!projectId) {
        if (loadingEl) loadingEl.classList.add('hidden');
        if (errorEl) errorEl.classList.remove('hidden');
        return;
      }

      try {
        const snapshot = await db.ref(`projects/${projectId}`).once('value');
        const project = snapshot.val();

        if (!project) {
          console.log('Project not found:', projectId);
          if (loadingEl) loadingEl.classList.add('hidden');
          if (errorEl) errorEl.classList.remove('hidden');
          return;
        }

        console.log('Project loaded:', project);

        // Hide loading, show content
        if (loadingEl) loadingEl.classList.add('hidden');
        if (contentEl) contentEl.classList.remove('hidden');

        // Update page title and meta
        document.getElementById('pageTitle').textContent = `${project.title} | ARKET Studio`;
        document.getElementById('pageDescription').setAttribute('content', project.description);

        // Set hero image
        const heroImage = document.getElementById('heroImage');
        if (heroImage) {
          heroImage.src = project.heroImage || 'assets/images/hero.jpg';
          heroImage.alt = project.title;
        }

        // Set project title
        const titleEl = document.getElementById('projectTitle');
        if (titleEl) titleEl.textContent = project.title;

        // Set project description
        const descEl = document.getElementById('projectDescription');
        if (descEl) descEl.textContent = project.description;

        // Set project details (split by line breaks for paragraphs)
        const detailsContainer = document.getElementById('projectDetails');
        if (detailsContainer && project.details) {
          const paragraphs = project.details.split('\n').filter(p => p.trim());
          detailsContainer.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
        }

        // Load gallery images
        const galleryContainer = document.getElementById('galleryContainer');
        if (galleryContainer) {
          galleryContainer.innerHTML = '';

          if (project.galleryImages && project.galleryImages.length > 0) {
            project.galleryImages.forEach((imageUrl, index) => {
              const img = document.createElement('img');
              img.src = imageUrl;
              img.alt = `${project.title} - View ${index + 1}`;
              img.className = 'w-full h-auto object-cover transform transition-transform duration-300 hover:scale-105 rounded';
              img.setAttribute('data-aos', 'fade-up');
              img.setAttribute('data-aos-delay', index * 100);
              
              galleryContainer.appendChild(img);
            });
          } else {
            galleryContainer.innerHTML = '<p class="text-center col-span-2 text-gray-500 dark:text-gray-400">No additional images available.</p>';
          }
        }

        // Refresh AOS
        if (typeof AOS !== 'undefined') {
          AOS.refresh();
        }

      } catch (error) {
        console.error('Error loading project:', error);
        if (loadingEl) loadingEl.classList.add('hidden');
        if (errorEl) errorEl.classList.remove('hidden');
      }
    }
  }
}

// ==================== EMAILJS CONTACT FORM ====================
(function () {
  if (typeof emailjs !== "undefined" && typeof window.APP_CONFIG !== "undefined") {
    emailjs.init(window.APP_CONFIG.emailjs.publicKey);
  }
})();

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    formStatus.textContent = "Sending message...";
    formStatus.className = "text-gray-600";

    emailjs
      .sendForm(
        window.APP_CONFIG.emailjs.serviceId,
        window.APP_CONFIG.emailjs.templateId,
        this
      )
      .then(
        () => {
          formStatus.textContent = "Message sent successfully!";
          formStatus.className = "text-green-600";
          contactForm.reset();
        },
        (error) => {
          formStatus.textContent = "Something went wrong. Please try again.";
          formStatus.className = "text-red-600";
          console.error("EmailJS Error:", error);
        }
      );
  });
}