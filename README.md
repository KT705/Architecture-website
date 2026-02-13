# 🏗️ ARKET Architecture Portfolio

Modern, responsive architecture portfolio website with a powerful admin panel for content management.

![Portfolio Screenshot](https://via.placeholder.com/800x400?text=ARKET+Portfolio)

## ✨ Features

- 🎨 **Dark Mode Support** - Elegant dark/light theme toggle
- 📱 **Fully Responsive** - Perfect on mobile, tablet, and desktop
- 🔐 **Admin Panel** - Password-protected content management system
- 🔥 **Firebase Backend** - No server needed, completely serverless
- 📧 **Contact Form** - EmailJS integration for instant notifications
- 🖼️ **Project Management** - Add, edit, and delete projects with images
- ⭐ **Featured Projects** - Select which projects appear on homepage
- 💬 **Client Reviews** - Manage testimonials
- 🚀 **Fast Loading** - Optimized performance with lazy loading
- ✍️ **Editable Content** - Update landing page text on the fly

## 🛠️ Tech Stack

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Backend**: Firebase (Realtime Database, Authentication)
- **Email**: EmailJS
- **Animations**: AOS (Animate On Scroll)
- **Icons**: Font Awesome

## 📂 Project Structure

```
arket-portfolio/
├── index.html              # Homepage
├── about.html             # About page
├── projects.html          # All projects listing
├── project-detail.html    # Individual project view
├── contact.html           # Contact form
├── admin-login.html       # Admin login page
├── admin-dashboard.html   # Admin panel
│
├── js/
│   ├── config.example.js  # Configuration template
│   ├── config.js          # Your actual config (git-ignored)
│   ├── firebase-config.js # Firebase initialization
│   ├── admin-login.js     # Login logic
│   ├── admin-dashboard.js # Admin panel logic
│   └── main.js            # Main site logic
│
├── assets/
│   └── images/            # Image assets
│
├── .gitignore             # Files to ignore in git
└── README.md              # This file
```

## 🚀 Quick Start

### For Developers

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/arket-portfolio.git
   cd arket-portfolio
   ```

2. **Set up configuration**
   ```bash
   # Copy the example config
   cp js/config.example.js js/config.js
   ```

3. **Add your credentials to `js/config.js`**
   - Firebase config (get from Firebase Console)
   - EmailJS keys (get from EmailJS Dashboard)

4. **Run locally**
   ```bash
   # Option 1: Python
   python -m http.server 8000
   
   # Option 2: Node.js
   npx serve
   
   # Option 3: VS Code Live Server
   # Right-click index.html → Open with Live Server
   ```

5. **Open in browser**
   ```
   http://localhost:8000
   ```

### Configuration Setup

See [SETUP.md](SETUP.md) for detailed configuration instructions.

## 🔑 Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Realtime Database in test mode
3. Enable Email/Password authentication
4. Create an admin user
5. Copy your config to `js/config.js`

**Security Rules (Important!):**
```json
{
  "rules": {
    ".read": true,
    ".write": "auth != null"
  }
}
```

This allows:
- ✅ Anyone can view the portfolio (public)
- ✅ Only authenticated users can edit (admin only)

## 📧 EmailJS Setup

1. Create account at https://www.emailjs.com/
2. Connect your email service (Gmail/Outlook)
3. Create email template
4. Get Public Key, Service ID, and Template ID
5. Add to `js/config.js`

## 🎯 Admin Panel

**Access:** `admin-login.html`

### Features:
- ✅ **Manage Projects** - Add, edit, delete projects
- ✅ **Upload Images** - Hero image + 4 gallery images per project
- ✅ **Featured Projects** - Select 3 projects for homepage
- ✅ **Landing Page** - Edit hero text and subtext
- ✅ **Client Reviews** - Add, edit, delete testimonials
- ✅ **Mobile Friendly** - Fully responsive admin interface

### Login Credentials:
Set up via Firebase Authentication. Default admin user should be created during Firebase setup.

## 🌐 Deployment

### GitHub Pages
```bash
git checkout -b gh-pages
git push origin gh-pages
```
Then enable Pages in repo settings.

### Netlify
1. Connect GitHub repository
2. Add environment variables (if using secrets)
3. Deploy automatically on push

### Vercel
1. Import GitHub repository  
2. Configure build settings
3. Deploy

## 🔒 Security

- ✅ API keys are stored in `config.js` (git-ignored)
- ✅ Only config template is committed to GitHub
- ✅ Firebase rules protect write operations
- ✅ Admin panel requires authentication
- ✅ Password reset functionality included

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Known Issues

None at the moment! Report issues via GitHub Issues.

## 📄 License

© 2026 ARKET Studio. All rights reserved.

This is a private portfolio website. Code structure and design are proprietary.

## 👨‍💻 Developer

Built by [Your Name]

For support or questions, contact: your.email@example.com

## 🙏 Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/)
- [EmailJS](https://www.emailjs.com/)
- [AOS](https://michalsnik.github.io/aos/)
- [Font Awesome](https://fontawesome.com/)

---

**Note**: This README is for developers. End users (clients) should refer to the admin panel for content management.