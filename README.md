# Club Website Project

This is a simple multi-page club website built as a demo for a university project. It includes pages for Home, About, Events, Gallery, Resources, Contact, Login and Signup.

Local features implemented:
- Multi-page structure (static HTML)
- Responsive layout via `style.css`
- Login & Signup using `localStorage` (demo only)
- Notices and default events persisted in `localStorage`
- Gallery images use placeholder images from `picsum.photos`

How to use locally:
1. Open `index.html` in your browser to view the Home page.
2. Go to `signup.html` to create a user account (demo only).
3. After creating an account, go to `login.html` to login. When logged in, the navbar shows the user name and a logout button.
4. For admin/demo, there's a default user: `admin@club.com` / `admin123`.

Notes & next steps:
- This project uses localStorage for demonstration; a production site needs a backend with authentication, database storage, file uploads, and secure password handling.
- Add image assets and curriculum files to the `assets/` folder.
- You can add more features like role-based admin pages to post notices and manage events.
