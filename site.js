// Shared navigation & footer injection for Holy Hour Website
// Cristo Viene Pronto by Deborah

const CONTACT_EMAIL = 'cristovieneprontobydeborah@gmail.com';

const navHTML = `
<div class="spiritual-banner" role="banner" aria-label="Spiritual message">
  <span class="banner-icon" aria-hidden="true">✝️</span>
  <span class="banner-text">Prepare Yourself — Remember Christ Is Coming Soon</span>
  <span class="banner-icon" aria-hidden="true">✝️</span>
</div>
<nav aria-label="Main navigation">
  <div class="nav-inner">
    <a href="index.html" class="nav-logo">✝ Cristo Viene Pronto by Deborah</a>
    <ul class="nav-links">
      <li><a href="index.html">Home</a></li>
      <li><a href="about.html">About</a></li>
      <li><a href="prayers.html">Prayers</a></li>
      <li><a href="rosary.html">Rosary</a></li>
      <li><a href="saints.html">Saints</a></li>
      <li><a href="schedule.html">Schedule</a></li>
      <li><a href="contact.html">Contact</a></li>
    </ul>
  </div>
</nav>`;

const footerHTML = `
<footer>
  <div class="footer-inner">
    <div class="footer-col">
      <h4>✝ Cristo Viene Pronto by Deborah</h4>
      <p>A Holy Hour website dedicated to prayer, reflection, and spiritual growth. Prepare your heart — Christ is coming soon.</p>
    </div>
    <div class="footer-col">
      <h4>Pages</h4>
      <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="prayers.html">Prayers</a></li>
        <li><a href="rosary.html">Rosary</a></li>
        <li><a href="saints.html">Saints</a></li>
        <li><a href="schedule.html">Schedule</a></li>
        <li><a href="contact.html">Contact</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Contact Us</h4>
      <p>📧 <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></p>
      <p style="margin-top:12px;color:var(--gold);font-style:italic;">"Watch therefore, for you know not what hour your Lord is coming." — Matthew 24:42</p>
    </div>
  </div>
  <div class="footer-bottom">
    <p>&copy; 2026 Cristo Viene Pronto by Deborah · Holy Hour Website · All rights reserved.</p>
  </div>
</footer>`;

function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Inject nav at top of body
  const navContainer = document.getElementById('nav-placeholder');
  if (navContainer) navContainer.innerHTML = navHTML;

  // Inject footer
  const footerContainer = document.getElementById('footer-placeholder');
  if (footerContainer) footerContainer.innerHTML = footerHTML;

  setActiveNav();
});
