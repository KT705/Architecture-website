// Admin Dashboard Logic
// Wait for Firebase to be initialized
(function() {
  'use strict';

  // Get Firebase from global scope
  const getAuth = () => window.firebaseApp.auth;
  const getDb = () => window.firebaseApp.db;

  // Check authentication
  getAuth().onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = 'admin-login.html';
    } else {
      loadDashboardData();
    }
  });

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', async () => {
    await getAuth().signOut();
    window.location.href = 'admin-login.html';
  });

  // ==================== NAVIGATION ====================
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const contentSections = document.querySelectorAll('.content-section');

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const closeSidebarBtn = document.getElementById('closeSidebarBtn');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openSidebar);
  }

  if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener('click', closeSidebar);
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
  }

  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSection = link.getAttribute('data-section');
      
      if (targetSection) {
        sidebarLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        contentSections.forEach(section => section.classList.remove('active'));
        document.getElementById(targetSection).classList.add('active');

        // Close sidebar on mobile after selection
        closeSidebar();
      }
    });
  });

  // ==================== LOAD DASHBOARD DATA ====================
  async function loadDashboardData() {
    loadProjects();
    loadSelectedProjects();
    loadLandingText();
    loadReviews();
    updateStats();
  }

  async function updateStats() {
    const projectsSnapshot = await getDb().ref('projects').once('value');
    const reviewsSnapshot = await getDb().ref('reviews').once('value');
    const selectedSnapshot = await getDb().ref('selectedProjects').once('value');
    
    document.getElementById('totalProjects').textContent = projectsSnapshot.numChildren();
    document.getElementById('totalReviews').textContent = reviewsSnapshot.numChildren();
    document.getElementById('selectedCount').textContent = selectedSnapshot.numChildren();
  }

  // ==================== PROJECTS MANAGEMENT ====================
  const projectModal = document.getElementById('projectModal');
  const addProjectBtn = document.getElementById('addProjectBtn');
  const cancelProjectBtn = document.getElementById('cancelProjectBtn');
  const projectForm = document.getElementById('projectForm');
  const heroImageInput = document.getElementById('heroImage');
  const galleryImagesInput = document.getElementById('galleryImages');

  addProjectBtn.addEventListener('click', () => {
    document.getElementById('modalTitle').textContent = 'Add New Project';
    projectForm.reset();
    document.getElementById('projectId').value = '';
    document.getElementById('heroPreview').classList.add('hidden');
    document.getElementById('galleryPreviews').innerHTML = '';
    projectModal.classList.remove('hidden');
  });

  cancelProjectBtn.addEventListener('click', () => {
    projectModal.classList.add('hidden');
  });

  // Hero image preview
  heroImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = document.getElementById('heroPreview');
        preview.src = e.target.result;
        preview.classList.remove('hidden');
      };
      reader.readAsDataURL(file);
    }
  });

  // Gallery images preview
  galleryImagesInput.addEventListener('change', (e) => {
    const previews = document.getElementById('galleryPreviews');
    previews.innerHTML = '';
    
    Array.from(e.target.files).slice(0, 4).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.className = 'preview-image rounded-lg';
        previews.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  });

  // Convert image to base64
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Save Project
  projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const projectId = document.getElementById('projectId').value || Date.now().toString();
    const title = document.getElementById('projectTitle').value;
    const description = document.getElementById('projectDescription').value;
    const details = document.getElementById('projectDetails').value;
    
    try {
      const projectData = {
        title,
        description,
        details,
        updatedAt: Date.now()
      };
      
      // Convert hero image to base64 if selected
      if (heroImageInput.files[0]) {
        projectData.heroImage = await fileToBase64(heroImageInput.files[0]);
      }
      
      // Convert gallery images to base64 if selected
      if (galleryImagesInput.files.length > 0) {
        const galleryUrls = [];
        for (let i = 0; i < Math.min(galleryImagesInput.files.length, 4); i++) {
          const base64 = await fileToBase64(galleryImagesInput.files[i]);
          galleryUrls.push(base64);
        }
        projectData.galleryImages = galleryUrls;
      }
      
      // Save to database
      await getDb().ref(`projects/${projectId}`).set(projectData);
      
      projectModal.classList.add('hidden');
      loadProjects();
      updateStats();
      alert('Project saved successfully!');
      
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project. Please try again.');
    }
  });

  // Load and display projects
  async function loadProjects() {
    const snapshot = await getDb().ref('projects').once('value');
    const projects = snapshot.val() || {};
    
    const projectsList = document.getElementById('projectsList');
    projectsList.innerHTML = '';
    
    Object.keys(projects).forEach(id => {
      const project = projects[id];
      const card = document.createElement('div');
      card.className = 'glass-card p-4 md:p-6 rounded-xl flex flex-col md:flex-row gap-4';
      card.innerHTML = `
        <img src="${project.heroImage || 'assets/images/hero.jpg'}" alt="${project.title}" class="w-full md:w-32 h-48 md:h-32 object-cover rounded-lg">
        <div class="flex-1">
          <h3 class="text-lg md:text-xl font-semibold mb-2">${project.title}</h3>
          <p class="text-white/60 text-sm mb-4">${project.description}</p>
          <div class="flex flex-wrap gap-2">
            <button onclick="editProject('${id}')" class="btn-primary px-4 py-2 rounded text-sm flex-1 sm:flex-none">
              Edit
            </button>
            <button onclick="deleteProject('${id}')" class="btn-danger px-4 py-2 rounded text-sm flex-1 sm:flex-none">
              Delete
            </button>
          </div>
        </div>
      `;
      projectsList.appendChild(card);
    });
  }

  // Edit Project
  window.editProject = async function(projectId) {
    const snapshot = await getDb().ref(`projects/${projectId}`).once('value');
    const project = snapshot.val();
    
    document.getElementById('modalTitle').textContent = 'Edit Project';
    document.getElementById('projectId').value = projectId;
    document.getElementById('projectTitle').value = project.title;
    document.getElementById('projectDescription').value = project.description;
    document.getElementById('projectDetails').value = project.details;
    
    if (project.heroImage) {
      const preview = document.getElementById('heroPreview');
      preview.src = project.heroImage;
      preview.classList.remove('hidden');
    }
    
    projectModal.classList.remove('hidden');
  };

  // Delete Project
  window.deleteProject = async function(projectId) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await getDb().ref(`projects/${projectId}`).remove();
      loadProjects();
      updateStats();
      alert('Project deleted successfully!');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project.');
    }
  };

  // ==================== SELECTED PROJECTS ====================
  async function loadSelectedProjects() {
    const allProjectsSnapshot = await getDb().ref('projects').once('value');
    const allProjects = allProjectsSnapshot.val() || {};
    
    const selectedSnapshot = await getDb().ref('selectedProjects').once('value');
    const selected = selectedSnapshot.val() || {};
    
    const container = document.getElementById('selectedProjectsList');
    container.innerHTML = '';
    
    for (let i = 1; i <= 3; i++) {
      const div = document.createElement('div');
      div.className = 'glass-card p-6 rounded-xl';
      div.innerHTML = `
        <label class="block text-sm mb-2">Selected Project ${i}</label>
        <select id="selected${i}" class="w-full px-4 py-3 rounded-lg">
          <option value="">-- Choose a project --</option>
          ${Object.keys(allProjects).map(id => `
            <option value="${id}" ${selected[`slot${i}`] === id ? 'selected' : ''}>
              ${allProjects[id].title}
            </option>
          `).join('')}
        </select>
      `;
      container.appendChild(div);
    }
    
    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn-primary px-8 py-3 rounded-lg font-semibold mt-4';
    saveBtn.textContent = 'Save Selected Projects';
    saveBtn.onclick = saveSelectedProjects;
    container.appendChild(saveBtn);
  }

  async function saveSelectedProjects() {
    const selected = {
      slot1: document.getElementById('selected1').value,
      slot2: document.getElementById('selected2').value,
      slot3: document.getElementById('selected3').value
    };
    
    await getDb().ref('selectedProjects').set(selected);
    alert('Selected projects updated!');
    updateStats();
  }

  // ==================== LANDING PAGE TEXT ====================
  async function loadLandingText() {
    const snapshot = await getDb().ref('landingText').once('value');
    const data = snapshot.val() || {};
    
    document.getElementById('heroHeading').value = data.heading || 'Designing spaces that inspire living';
    document.getElementById('heroSubtext').value = data.subtext || 'A modern architecture studio focused on clarity, purpose and timeless design.';
  }

  document.getElementById('landingForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
      heading: document.getElementById('heroHeading').value,
      subtext: document.getElementById('heroSubtext').value
    };
    
    await getDb().ref('landingText').set(data);
    
    const success = document.getElementById('landingSuccess');
    success.classList.remove('hidden');
    setTimeout(() => success.classList.add('hidden'), 3000);
  });

  // ==================== REVIEWS MANAGEMENT ====================
  const reviewModal = document.getElementById('reviewModal');
  const addReviewBtn = document.getElementById('addReviewBtn');
  const cancelReviewBtn = document.getElementById('cancelReviewBtn');
  const reviewForm = document.getElementById('reviewForm');

  addReviewBtn.addEventListener('click', () => {
    document.getElementById('reviewModalTitle').textContent = 'Add New Review';
    reviewForm.reset();
    document.getElementById('reviewId').value = '';
    reviewModal.classList.remove('hidden');
  });

  cancelReviewBtn.addEventListener('click', () => {
    reviewModal.classList.add('hidden');
  });

  reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const reviewId = document.getElementById('reviewId').value || Date.now().toString();
    const name = document.getElementById('reviewName').value;
    const text = document.getElementById('reviewText').value;
    
    await getDb().ref(`reviews/${reviewId}`).set({ name, text });
    
    reviewModal.classList.add('hidden');
    loadReviews();
    updateStats();
    alert('Review saved!');
  });

  async function loadReviews() {
    const snapshot = await getDb().ref('reviews').once('value');
    const reviews = snapshot.val() || {};
    
    const reviewsList = document.getElementById('reviewsList');
    reviewsList.innerHTML = '';
    
    Object.keys(reviews).forEach(id => {
      const review = reviews[id];
      const card = document.createElement('div');
      card.className = 'glass-card p-6 rounded-xl';
      card.innerHTML = `
        <p class="text-white/80 mb-4">"${review.text}"</p>
        <p class="font-semibold">— ${review.name}</p>
        <div class="flex gap-2 mt-4">
          <button onclick="editReview('${id}')" class="btn-primary px-4 py-2 rounded text-sm">
            Edit
          </button>
          <button onclick="deleteReview('${id}')" class="btn-danger px-4 py-2 rounded text-sm">
            Delete
          </button>
        </div>
      `;
      reviewsList.appendChild(card);
    });
  }

  window.editReview = async function(reviewId) {
    const snapshot = await getDb().ref(`reviews/${reviewId}`).once('value');
    const review = snapshot.val();
    
    document.getElementById('reviewModalTitle').textContent = 'Edit Review';
    document.getElementById('reviewId').value = reviewId;
    document.getElementById('reviewName').value = review.name;
    document.getElementById('reviewText').value = review.text;
    
    reviewModal.classList.remove('hidden');
  };

  window.deleteReview = async function(reviewId) {
    if (!confirm('Delete this review?')) return;
    
    await getDb().ref(`reviews/${reviewId}`).remove();
    loadReviews();
    updateStats();
    alert('Review deleted!');
  };

})();