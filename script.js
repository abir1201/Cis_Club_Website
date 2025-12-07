// script.js - optimized club site logic
document.addEventListener('DOMContentLoaded', () => {
  setYear(); initData(); populateNavAuth(); loadNotices();
  loadGallery(); loadHomeGallery(); initGalleryAutoScroll(); loadEvents(); attachFormHandlers();
  ['AddNotice','AddEvent','UploadSection','HomeUpload'].forEach(t => window[`show${t}IfLogged`]?.());
});

const L = (k,d) => JSON.parse(localStorage.getItem(k) || JSON.stringify(d));
const S = (k,v) => localStorage.setItem(k, JSON.stringify(v));
const $ = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);
const QS = (sel) => document.querySelector(sel);

function setYear(){
  $$('[id^="year"]').forEach(s => s.textContent = new Date().getFullYear());
}

function initData(){
  if(!localStorage.getItem('notices')) S('notices', [{id:1,title:'Welcome to the Club!',body:'Join our workshops and projects this semester',date:new Date().toLocaleDateString()},{id:2,title:'First Meeting',body:'Our kickoff meeting is on Monday at 6pm in room A103',date:new Date().toLocaleDateString()}]);
  if(!localStorage.getItem('events')) S('events', [{id:1,title:'Workshop: Intro to Web Development',date:'2026-01-10',time:'10:00 AM',venue:'Lab 2',description:'Learn HTML, CSS, and JavaScript basics. Perfect for beginners. Bring your laptop!'},{id:2,title:'Seminar: Career Paths in Tech',date:'2026-01-25',time:'3:00 PM',venue:'Auditorium',description:'Meet with senior professionals and alumni from the tech industry. Q&A session included.'},{id:3,title:'Hackathon 2026',date:'2026-02-14',time:'9:00 AM',venue:'Computer Lab',description:'24-hour coding competition. Build innovative projects and win prizes!'},{id:4,title:'Networking Dinner',date:'2026-02-28',time:'6:30 PM',venue:'Club Hall',description:'Connect with industry experts and fellow club members over dinner.'},{id:5,title:'Project Showcase',date:'2026-03-15',time:'2:00 PM',venue:'Main Auditorium',description:'Display and demo your semester projects to the entire club community.'}]);
  if(!localStorage.getItem('users')) S('users', [{name:'Admin',email:'admin@club.com',password:'admin123'}]);
}

function attachFormHandlers(){
  const signup = $('signup-form');
  signup?.addEventListener('submit', e => {
    e.preventDefault();
    const users = L('users', []), email = $('s-email').value.toLowerCase().trim();
    if(users.find(u => u.email === email)) return void ($('signup-msg').textContent = 'Email exists', $('signup-msg').style.color = 'crimson');
    users.push({name: $('name').value.trim(), email, password: $('s-password').value});
    S('users', users);
    $('signup-msg').textContent = 'Account created!';
    $('signup-msg').style.color = 'green';
    signup.reset();
  });

  const login = $('login-form');
  login?.addEventListener('submit', e => {
    e.preventDefault();
    const user = L('users', []).find(u => u.email === $('email').value.toLowerCase().trim() && u.password === $('password').value);
    if(user) return S('currentUser', user), $('login-msg').style.color = 'green', $('login-msg').textContent = 'Redirecting...', void setTimeout(() => location.href = 'index.html', 700);
    $('login-msg').style.color = 'crimson';
    $('login-msg').textContent = 'Invalid credentials';
  });

  $('contact-form')?.addEventListener('submit', e => {
    e.preventDefault(); $('contact-msg').textContent = 'Message received!'; $('contact-form').reset();
  });
}

function logout(){
  localStorage.removeItem('currentUser');
  populateNavAuth();
}

function populateNavAuth(){
  const user = L('currentUser', null);
  $$('.login-link').forEach(n => n.style.display = user ? 'none' : 'inline');
  QS('.nav-user')?.remove();
  if(!user) return;
  const li = document.createElement('li');
  li.className = 'nav-user';
  li.innerHTML = `<a class="nav-link" href="#">${user.name}</a> <button id='logout-btn' class='btn' style='margin-left:10px;padding:.4rem .6rem;'>Logout</button>`;
  QS('.nav-list').appendChild(li);
  $('logout-btn').addEventListener('click', logout);
}

function loadNotices(){
  const el = $('notices-list');
  if(!el) return;
  const notices = L('notices', []);
  el.innerHTML = notices.length ? notices.map(n => `<div class="notice"><strong>${n.title}</strong><div class="meta">${n.date}</div>${n.body}</div>`).join('') : '<div class="notice">No notices</div>';
  updateNoticeHeadline();
}

function loadGallery(){
  // Gallery is now static - managed in gallery.html
  // Uploaded photos are no longer displayed
}

function loadHomeGallery(){
  const grid = $('home-gallery-grid');
  if(!grid) return;
  grid.innerHTML = '';
  const assetImages = [
    {src: 'assets/p1.jpg', title: 'Workshop Session'},
    {src: 'assets/p2.jpg', title: 'Seminar Discussion'},
    {src: 'assets/p3.jpg', title: 'Club Event'},
    {src: 'assets/p4.jpg', title: 'Team Meeting'},
    {src: 'assets/p5.jpg', title: 'Hackathon 2025'}
  ];
  assetImages.forEach(p => {
    const card = document.createElement('div');
    card.style.cssText = 'flex:0 0 280px;min-width:280px;padding:0.5rem';
    card.innerHTML = `<img class="photo-3d" src="${p.src}" style="width:100%;height:200px;border-radius:6px;object-fit:cover"><div style="margin-top:.5rem;font-weight:bold">${p.title}</div>`;
    grid.appendChild(card);
  });
}

function removeGalleryPhoto(idx){
  const photos = L('galleryPhotos', []);
  photos.splice(idx, 1);
  S('galleryPhotos', photos);
  loadGallery();
  loadHomeGallery();
}

function removePlaceholder(seed){
  const arr = L('galleryHiddenPlaceholders', []);
  if(!arr.includes(seed)) arr.push(seed);
  S('galleryHiddenPlaceholders', arr);
  loadGallery();
}

function loadEvents(){
  const el = $('events-list');
  if(!el) return;
  const events = L('events', []);
  el.innerHTML = events.length ? events.map(e => `<div class="event-card">${e.image ? `<img src="${e.image}" alt="${e.title}" class="event-image">` : ''}<h3>${e.title}</h3><div class="event-meta"><span>📅 ${e.date}</span>${e.time ? ` <span>⏰ ${e.time}</span>` : ''}${e.venue ? ` <span>📍 ${e.venue}</span>` : ''}</div><p>${e.description}</p></div>`).join('') : '<div class="card">No events yet</div>';
}

function addEvent(title, date, time, venue, description, image){
  const events = L('events', []);
  events.push({id: events.length + 1, title, date, time, venue, description, image});
  S('events', events);
  loadEvents();
}

function createNoticeHeadline(){
  if(QS('.site-headline')) return;
  const header = QS('.site-header');
  if(!header) return;
  const banner = document.createElement('div');
  banner.className = 'site-headline';
  banner.innerHTML = '<div class="container"><div class="meta" id="headline-text"></div><button class="close-headline" id="close-headline" title="Dismiss">✕</button></div>';
  header.parentNode.insertBefore(banner, header.nextSibling);
  $('close-headline').addEventListener('click', () => banner.style.display = 'none');
  updateNoticeHeadline();
}

function updateNoticeHeadline(){
  const el = $('headline-text');
  if(!el) return;
  const notices = L('notices', []);
  el.innerHTML = notices.length ? `<a href="index.html">${escapeHtml(notices[notices.length-1].title)}</a>` : '';
}

function escapeHtml(str){
  return !str ? '' : String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function initGalleryAutoScroll(){
  const grid = $('gallery-grid');
  if(!grid) return;
  let pos = 0, auto = true, raf = null, timer = null;
  const speed = 2.5;
  const scroll = () => {
    if(!auto) return void (raf = null);
    pos += speed;
    const max = grid.scrollWidth - grid.clientWidth;
    if(pos > max) pos = 0;
    grid.scrollLeft = pos;
    raf = requestAnimationFrame(scroll);
  };
  grid.addEventListener('mouseenter', () => auto = false);
  grid.addEventListener('mouseleave', () => auto = true);
  grid.addEventListener('scroll', () => {
    auto = false;
    clearTimeout(timer);
    timer = setTimeout(() => auto = true, 2000);
  });
  requestAnimationFrame(scroll);
}

function showAddNoticeIfLogged(){
  const user = L('currentUser', null), el = $('add-notice');
  if(!el) return;
  if(!user) return void (el.style.display = 'none');
  el.style.display = 'block';
  const form = $('add-notice-form');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    addNotice($('n-title').value.trim(), $('n-body').value.trim());
    $('add-notice-msg').textContent = 'Published!';
    form.reset();
  });
}

function showAddEventIfLogged(){
  const user = L('currentUser', null), el = $('add-event');
  if(!el) return;
  if(!user) return void (el.style.display = 'none');
  const form = $('add-event-form');
  const toggleBtn = $('toggle-event-form');
  const cancelBtn = $('cancel-event');
  if(toggleBtn) toggleBtn.style.display = 'block';
  if(toggleBtn) toggleBtn.addEventListener('click', () => el.style.display = el.style.display === 'none' ? 'block' : 'none');
  if(cancelBtn) cancelBtn.addEventListener('click', () => { el.style.display = 'none'; form.reset(); $('image-preview').innerHTML = ''; });
  const imageInput = $('e-image');
  if(imageInput && !imageInput._done){
    imageInput.addEventListener('change', e => {
      const file = e.target.files[0];
      const preview = $('image-preview');
      if(!file || !preview) return;
      const reader = new FileReader();
      reader.onload = ev => {
        preview.innerHTML = `<img src="${ev.target.result}" style="max-width:200px;max-height:150px;border-radius:6px;margin-bottom:0.5rem;">`;
      };
      reader.readAsDataURL(file);
    });
    imageInput._done = true;
  }
  if(form && !form._done){
    form.addEventListener('submit', e => {
      e.preventDefault();
      let img = '';
      const file = $('e-image').files[0];
      if(file){
        const reader = new FileReader();
        reader.onload = ev => {
          addEvent($('e-title').value.trim(), $('e-date').value, $('e-time').value, $('e-venue').value.trim(), $('e-desc').value.trim(), ev.target.result);
          $('add-event-msg').textContent = 'Event added!';
          form.reset();
          $('image-preview').innerHTML = '';
          el.style.display = 'none';
        };
        reader.readAsDataURL(file);
      } else {
        addEvent($('e-title').value.trim(), $('e-date').value, $('e-time').value, $('e-venue').value.trim(), $('e-desc').value.trim(), '');
        $('add-event-msg').textContent = 'Event added!';
        form.reset();
        $('image-preview').innerHTML = '';
        el.style.display = 'none';
      }
    });
    form._done = true;
  }
}

function showUploadSectionIfLogged(){
  const user = L('currentUser', null), el = $('upload-section');
  if(!el) return;
  if(!user) return void (el.style.display = 'none');
  el.style.display = 'block';
  const form = $('gallery-upload-form');
  if(form && !form._done){
    form.addEventListener('submit', e => {
      e.preventDefault();
      const file = $('photo-file').files[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const photos = L('galleryPhotos', []);
        photos.unshift({title: $('photo-title').value.trim(), src: ev.target.result, uploadedBy: user.name, date: new Date().toLocaleDateString()});
        S('galleryPhotos', photos);
        $('upload-msg').style.color = 'green';
        $('upload-msg').textContent = 'Uploaded!';
        form.reset();
        loadGallery();
      };
      reader.readAsDataURL(file);
    });
    form._done = true;
  }
}

function showHomeUploadIfLogged(){
  const user = L('currentUser', null), el = $('home-upload-section');
  if(!el) return;
  if(!user) return void (el.style.display = 'none');
  el.style.display = 'block';
  const form = $('home-upload-form');
  if(form && !form._done){
    form.addEventListener('submit', e => {
      e.preventDefault();
      const file = $('home-photo-file').files[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const photos = L('galleryPhotos', []);
        photos.unshift({title: $('home-photo-title').value.trim(), src: ev.target.result, uploadedBy: user.name, date: new Date().toLocaleDateString()});
        S('galleryPhotos', photos);
        $('home-upload-msg').style.color = 'green';
        $('home-upload-msg').textContent = 'Added to gallery!';
        form.reset();
        loadHomeGallery();
        loadGallery();
      };
      reader.readAsDataURL(file);
    });
    form._done = true;
  }
}

function applyTheme(t){
  if(!t) return;
  const r = document.documentElement.style;
  r.setProperty('--primary', t.primary || '');
  r.setProperty('--bg', t.bg || '');
  r.setProperty('--card', t.card || '');
  r.setProperty('--text', t.text || '');
  r.setProperty('--muted', t.muted || '');
  r.setProperty('--header-bg', t.headerBg || '');
  r.setProperty('--link-hover', t.linkHover || '');
  r.setProperty('--font-family', t.fontFamily || '');
  r.setProperty('--bg-image', t.bgImage ? `url("${t.bgImage}")` : '');
}

function saveTheme(t){ S('siteTheme', t); }
function loadTheme(){ try { return L('siteTheme', null); } catch(e) { return null; } }

function rgbToHex(rgb){
  if(!rgb) return '#000000';
  if(rgb.startsWith('#')) return rgb;
  const m = rgb.match(/rgba?\((\d+),(\d+),(\d+)/i);
  if(!m) return '#000000';
  return `#${parseInt(m[1]).toString(16).padStart(2,'0')}${parseInt(m[2]).toString(16).padStart(2,'0')}${parseInt(m[3]).toString(16).padStart(2,'0')}`;
}

function applyReduceMotion(v){
  window._reducedMotion = !!v;
  document.body.classList.toggle('reduced-motion', !!v);
  $$('.card').forEach(c => { if(v) c.style.transform = 'none'; else c.style.removeProperty('transform'); });
}

function createThemePanel(){
  if($('theme-toggle')) return;
  const toggle = document.createElement('button');
  toggle.id = 'theme-toggle';
  toggle.className = 'theme-toggle';
  toggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 0 1 2.7 17.88l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09c.67 0 1.24-.42 1.51-1a1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 0 1 6.12 2.7l.06.06a1.65 1.65 0 0 0 1.82.33H8a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09c0 .6.4 1.13 1 1.51h.06a1.65 1.65 0 0 0 1.82-.33l.06-.06A2 2 0 0 1 21.3 6.12l-.06.06a1.65 1.65 0 0 0-.33 1.82V8c.36.76.97 1.37 1.73 1.73h.06A2 2 0 0 1 21.3 14.12l-.06.06c-.2.2-.4.38-.63.54z"></path></svg><span style="margin-left:8px;font-weight:600">Theme</span>';
  document.body.appendChild(toggle);

  const panel = document.createElement('div');
  panel.className = 'theme-panel';
  panel.id = 'theme-panel';
  panel.innerHTML = `<h4>Theme</h4><div class="theme-row"><label>Presets</label><div class="theme-controls"><button class="btn" id="preset-light">Light</button><button class="btn" id="preset-dark">Dark</button><button class="btn" id="preset-pastel">Pastel</button><button class="btn" id="preset-corp">Corporate</button></div></div><div class="theme-row"><label>Primary</label><input id="theme-primary" type="color"></div><div class="theme-row"><label>Background</label><input id="theme-bg" type="color"></div><div class="theme-row"><label>Card</label><input id="theme-card" type="color"></div><div class="theme-row"><label>Text</label><input id="theme-text" type="color"></div><div class="theme-row"><label>Font</label><select id="theme-font"><option value="Inter, system-ui, -apple-system, 'Segoe UI', Roboto">Inter / System</option><option value="'Roboto', sans-serif">Roboto</option><option value="'Poppins', sans-serif">Poppins</option><option value="Georgia, serif">Georgia</option></select></div><div class="theme-row"><label>BG Image</label><input id="theme-bg-file" type="file" accept="image/*"></div><div class="theme-row"><label>BG URL</label><div style="display:flex;gap:.3rem"><input id="theme-bg-url" type="text" placeholder="https://" style="flex:1"><button class="btn" id="theme-bg-set-url">Set</button><button class="btn" id="theme-bg-clear">Clear</button></div></div><div class="theme-row"><label>Reduce Motion</label><input id="theme-reduce-motion" type="checkbox"></div><div style="display:flex;gap:.5rem;margin-top:.5rem"><button id="theme-reset" class="btn">Reset</button><button id="theme-close" class="btn">Close</button></div>`;
  document.body.appendChild(panel);

  const tPrimary = $('theme-primary'), tBg = $('theme-bg'), tCard = $('theme-card'), tText = $('theme-text'), tFont = $('theme-font'), tReduce = $('theme-reduce-motion'), tReset = $('theme-reset'), tClose = $('theme-close'), tBgFile = $('theme-bg-file'), tBgUrl = $('theme-bg-url'), tBgSet = $('theme-bg-set-url'), tBgClear = $('theme-bg-clear');
  const current = loadTheme() || {};
  let panelBg = current.bgImage || null;

  tPrimary.value = current.primary || '#0b63d6';
  tBg.value = current.bg || '#f7f9fc';
  tCard.value = current.card || '#ffffff';
  tText.value = current.text || '#1f2937';
  tFont.value = current.fontFamily || "Inter, system-ui";
  if(tReduce) tReduce.checked = !!current.reduceMotion;

  function commit(){
    const t = {primary: tPrimary.value, bg: tBg.value, card: tCard.value, text: tText.value, fontFamily: tFont.value, bgImage: panelBg, reduceMotion: tReduce?.checked};
    applyTheme(t);
    saveTheme(t);
    if(typeof applyReduceMotion === 'function') applyReduceMotion(!!t.reduceMotion);
  }

  [tPrimary, tBg, tCard, tText].forEach(inp => inp.addEventListener('input', commit));
  tFont.addEventListener('change', commit);
  if(tReduce) tReduce.addEventListener('change', commit);
  tBgFile?.addEventListener('change', e => {
    const f = e.target.files[0];
    if(!f) return;
    const reader = new FileReader();
    reader.onload = ev => { panelBg = ev.target.result; commit(); };
    reader.readAsDataURL(f);
  });
  tBgSet?.addEventListener('click', () => { const u = tBgUrl?.value.trim(); if(u) panelBg = u, commit(); });
  tBgClear?.addEventListener('click', () => { panelBg = null; if(tBgUrl) tBgUrl.value = ''; if(tBgFile) tBgFile.value = ''; commit(); });
  tReset.addEventListener('click', () => { localStorage.removeItem('siteTheme'); location.reload(); });
  tClose.addEventListener('click', () => panel.style.display = 'none');
  toggle.addEventListener('click', () => panel.style.display = panel.style.display === 'block' ? 'none' : 'block');

  const navRow = QS('.nav-row');
  if(navRow && !$('theme-header-btn')){
    const btn = document.createElement('button');
    btn.id = 'theme-header-btn';
    btn.className = 'theme-header-btn';
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:16px;height:16px"><circle cx="12" cy="12" r="3"></circle></svg><span style="font-weight:600">Theme</span>';
    navRow.appendChild(btn);
    btn.addEventListener('click', () => { panel.style.display = 'block'; });
  }

  const presets = {
    light: {primary:'#0b63d6',bg:'#f7f9fc',card:'#fff',text:'#1f2937',fontFamily:"Inter, system-ui"},
    dark: {primary:'#7c3aed',bg:'#0b1220',card:'#0f1724',text:'#e6eef7',fontFamily:"Inter, system-ui"},
    pastel: {primary:'#6ee7b7',bg:'#fffaf0',card:'#fff7ed',text:'#1f2937',fontFamily:"'Poppins', sans-serif"},
    corp: {primary:'#0b63d6',bg:'#fff',card:'#f4f6fb',text:'#0f1724',fontFamily:"'Roboto', sans-serif"}
  };
  Object.entries(presets).forEach(([k,p]) => {
    $(`preset-${k}`)?.addEventListener('click', () => {
      applyTheme(p);
      saveTheme(p);
      tPrimary.value = p.primary;
      tBg.value = p.bg;
      tCard.value = p.card;
      tText.value = p.text;
      tFont.value = p.fontFamily;
    });
  });

  panel.style.display = loadTheme() ? 'none' : 'block';
}

const saved = loadTheme();
if(saved) applyTheme(saved);
createThemePanel();
if(saved?.reduceMotion) applyReduceMotion(saved.reduceMotion);

// Parallax + card tilt
(function(){
  let raf = null, lastY = 0;
  window.addEventListener('scroll', () => {
    if(window._reducedMotion) return;
    lastY = window.scrollY;
    if(!raf) raf = requestAnimationFrame(() => {
      const y = Math.round(lastY * 0.12);
      document.documentElement.style.setProperty('--bg-y', `${-y}px`);
      document.body.style.setProperty('--bg-translate', `${-y}px`);
      raf = null;
    });
  }, {passive: true});

  function enableCardTilt(){
    if(window._reducedMotion) return;
    $$('.cards').forEach(grid => {
      grid.addEventListener('mousemove', e => {
        if(window._reducedMotion) return;
        $$('.card', grid).forEach(card => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          const tiltX = (y / rect.height) * 10;
          const tiltY = (x / rect.width) * -10;
          card.style.setProperty('--tiltX', `${tiltX}deg`);
          card.style.setProperty('--tiltY', `${tiltY}deg`);
        });
      });
      grid.addEventListener('mouseleave', () => {
        $$('.card', grid).forEach(c => {
          c.style.setProperty('--tiltX', '0deg');
          c.style.setProperty('--tiltY', '0deg');
        });
      });
    });
  }
  enableCardTilt();
})();

window._club = {addNotice, loadNotices, logout};
