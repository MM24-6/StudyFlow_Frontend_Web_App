/**
 * StudyFlow — Core Application Utilities
 * Theme, navigation, toasts, modals, icons
 */

const StudyFlowApp = {
  init(page) {
    this.initTheme();
    this.initIcons();
    if (page && page !== 'landing') {
      this.initSidebar(page);
      this.initTopbar();
      this.initMobileMenu();
    }
    this.createToastContainer();
  },

  initTheme() {
    const theme = getTheme();
    document.documentElement.setAttribute('data-theme', theme);
  },

  toggleTheme() {
    const current = getTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    saveTheme(next);
    this.showToast(`Switched to ${next} mode`, 'info');
  },

  initIcons() {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },

  refreshIcons() {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },

  createToastContainer() {
    if (!document.querySelector('.toast-container')) {
      const container = document.createElement('div');
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      document.body.appendChild(container);
    }
  },

  showToast(message, type = 'success') {
    const container = document.querySelector('.toast-container');
    if (!container) return;

    const icons = {
      success: 'check-circle',
      error: 'x-circle',
      warning: 'alert-triangle',
      info: 'info'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <i data-lucide="${icons[type] || 'info'}" class="toast-icon"></i>
      <span class="toast-message">${message}</span>
      <button class="toast-close" aria-label="Dismiss notification">
        <i data-lucide="x" style="width:16px;height:16px"></i>
      </button>
    `;

    container.appendChild(toast);
    this.refreshIcons();

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => this.removeToast(toast));

    setTimeout(() => this.removeToast(toast), 4000);
  },

  removeToast(toast) {
    if (!toast || toast.classList.contains('removing')) return;
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  },

  openModal(modalId) {
    const overlay = document.getElementById(modalId);
    if (!overlay) return;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const firstInput = overlay.querySelector('input, select, textarea, button');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);

    const closeHandler = (e) => {
      if (e.key === 'Escape') {
        this.closeModal(modalId);
        document.removeEventListener('keydown', closeHandler);
      }
    };
    document.addEventListener('keydown', closeHandler);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.closeModal(modalId);
    });
  },

  closeModal(modalId) {
    const overlay = document.getElementById(modalId);
    if (!overlay) return;
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  },

  initSidebar(activePage) {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const navItems = [
      { href: 'dashboard.html', icon: 'layout-dashboard', label: 'Overview', page: 'dashboard' },
      { href: 'courses.html', icon: 'book-open', label: 'Courses', page: 'courses' },
      { href: 'assignments.html', icon: 'clipboard-list', label: 'Assignments', page: 'assignments' },
      { href: 'planner.html', icon: 'calendar', label: 'Planner', page: 'planner' },
      { href: 'notes.html', icon: 'sticky-note', label: 'Notes', page: 'notes' },
      { href: 'analytics.html', icon: 'bar-chart-3', label: 'Analytics', page: 'analytics' },
      { href: 'settings.html', icon: 'settings', label: 'Settings', page: 'settings' }
    ];

    const prefs = getPreferences();
    sidebar.innerHTML = `
      <div class="sidebar-header">
        <a href="index.html" class="logo logo-sm">
          <div class="logo-icon"><i data-lucide="graduation-cap"></i></div>
          StudyFlow
        </a>
      </div>
      <nav class="sidebar-nav" aria-label="Main navigation">
        ${navItems.map(item => `
          <a href="${item.href}" class="sidebar-link ${activePage === item.page ? 'active' : ''}" ${activePage === item.page ? 'aria-current="page"' : ''}>
            <i data-lucide="${item.icon}"></i>
            ${item.label}
          </a>
        `).join('')}
      </nav>
      <div class="sidebar-footer">
        <a href="contact.html" class="sidebar-link">
          <i data-lucide="message-circle"></i>
          Contact
        </a>
      </div>
    `;
  },

  initTopbar() {
    const topbar = document.getElementById('topbar');
    if (!topbar) return;

    const prefs = getPreferences();
    topbar.innerHTML = `
      <div class="topbar-left">
        <button class="mobile-menu-btn topbar-btn" id="mobileMenuBtn" aria-label="Open menu">
          <i data-lucide="menu"></i>
        </button>
        <div class="search-box">
          <i data-lucide="search"></i>
          <input type="search" id="globalSearch" placeholder="Search..." aria-label="Search">
        </div>
      </div>
      <div class="topbar-right">
        <button class="topbar-btn" id="themeToggle" aria-label="Toggle theme">
          <i data-lucide="sun" id="themeIcon"></i>
        </button>
        <div style="position:relative">
          <button class="topbar-btn" id="notificationBtn" aria-label="Notifications">
            <i data-lucide="bell"></i>
            <span class="notification-dot"></span>
          </button>
          <div class="notification-panel" id="notificationPanel">
            <div class="notification-panel-header">Notifications</div>
            <div class="notification-item">
              <div class="notification-item-title">Assignment Due Soon</div>
              <div class="notification-item-text">Neural Network Implementation due in 3 days</div>
            </div>
            <div class="notification-item">
              <div class="notification-item-title">Study Reminder</div>
              <div class="notification-item-text">Machine Learning session at 2:00 PM today</div>
            </div>
            <div class="notification-item">
              <div class="notification-item-title">Progress Update</div>
              <div class="notification-item-text">You reached 72% in Web Development</div>
            </div>
          </div>
        </div>
        <a href="settings.html" class="user-avatar" aria-label="Profile settings" title="${prefs.name}">${prefs.avatar}</a>
      </div>
    `;

    this.updateThemeIcon();
    this.bindTopbarEvents();
  },

  bindTopbarEvents() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggleTheme();
        this.updateThemeIcon();
      });
    }

    const notificationBtn = document.getElementById('notificationBtn');
    const notificationPanel = document.getElementById('notificationPanel');
    if (notificationBtn && notificationPanel) {
      notificationBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notificationPanel.classList.toggle('open');
      });
      document.addEventListener('click', () => {
        notificationPanel.classList.remove('open');
      });
    }

    const globalSearch = document.getElementById('globalSearch');
    if (globalSearch) {
      globalSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const query = e.target.value.trim().toLowerCase();
          if (query) {
            window.location.href = `assignments.html?search=${encodeURIComponent(query)}`;
          }
        }
      });
    }
  },

  updateThemeIcon() {
    const icon = document.getElementById('themeIcon');
    if (!icon) return;
    const theme = getTheme();
    icon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
    this.refreshIcons();
  },

  initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    let overlay = document.querySelector('.sidebar-overlay');

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';
      document.body.appendChild(overlay);
    }

    const closeMenu = () => {
      sidebar?.classList.remove('open');
      overlay.classList.remove('visible');
      document.body.style.overflow = '';
    };

    const openMenu = () => {
      sidebar?.classList.add('open');
      overlay.classList.add('visible');
      document.body.style.overflow = 'hidden';
    };

    menuBtn?.addEventListener('click', () => {
      if (sidebar?.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    overlay.addEventListener('click', closeMenu);

    sidebar?.querySelectorAll('.sidebar-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  },

  initLandingNav() {
    const nav = document.querySelector('.landing-nav');
    if (nav) {
      window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 20);
      });
    }

    const toggle = document.getElementById('mobileNavToggle');
    const links = document.querySelector('.landing-nav-links');
    toggle?.addEventListener('click', () => {
      links?.classList.toggle('open');
    });

    const themeToggle = document.getElementById('landingThemeToggle');
    themeToggle?.addEventListener('click', () => {
      this.toggleTheme();
      this.updateLandingThemeIcon();
    });
    this.updateLandingThemeIcon();
  },

  updateLandingThemeIcon() {
    const icon = document.getElementById('landingThemeIcon');
    if (!icon) return;
    icon.setAttribute('data-lucide', getTheme() === 'dark' ? 'sun' : 'moon');
    this.refreshIcons();
  },

  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  validateRequired(value) {
    return value && value.trim().length > 0;
  },

  showFormError(input, message) {
    input.classList.add('error');
    const group = input.closest('.form-group');
    const errorEl = group?.querySelector('.form-error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }
  },

  clearFormErrors(form) {
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    form.querySelectorAll('.form-error').forEach(el => {
      el.classList.remove('visible');
      el.textContent = '';
    });
  },

  confirmAction(message) {
    return window.confirm(message);
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  getPriorityBadge(priority) {
    const labels = { high: 'High', medium: 'Medium', low: 'Low' };
    return `<span class="badge badge-${priority}">${labels[priority] || priority}</span>`;
  },

  getStatusBadge(status) {
    const labels = {
      pending: 'Pending',
      'in-progress': 'In Progress',
      completed: 'Completed'
    };
    return `<span class="badge badge-${status}">${labels[status] || status}</span>`;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  StudyFlowApp.init(page);

  if (page === 'landing') {
    StudyFlowApp.initLandingNav();
  }
});
