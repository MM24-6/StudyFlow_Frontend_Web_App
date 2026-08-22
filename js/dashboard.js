/**
 * StudyFlow — Dashboard Page
 */

document.addEventListener('DOMContentLoaded', () => {
  renderWelcome();
  renderStats();
  renderWeeklyChart();
  renderUpcomingTasks();
  renderTodaySchedule();
  renderActivity();
  bindQuickActions();
  bindQuickForms();
  bindModalCloseButtons();
});

function renderWelcome() {
  const prefs = getPreferences();
  const el = document.getElementById('welcomeMessage');
  if (el) {
    el.textContent = `${getGreeting()}, ${prefs.name} 👋`;
  }
}

function renderStats() {
  const stats = getDashboardStats();
  const container = document.getElementById('statsCards');
  if (!container) return;

  const cards = [
    { label: 'Tasks Completed', value: stats.tasksCompleted, icon: 'check-circle', color: 'green', trend: '+12%', up: true },
    { label: 'Pending Assignments', value: stats.pendingAssignments, icon: 'clock', color: 'orange', trend: '-2', up: false },
    { label: 'Study Hours', value: stats.studyHours, icon: 'timer', color: 'cyan', trend: '+3.5h', up: true },
    { label: 'Overall Progress', value: stats.overallProgress + '%', icon: 'trending-up', color: 'purple', trend: '+5%', up: true }
  ];

  container.innerHTML = cards.map(c => `
    <div class="stat-card">
      <div class="stat-card-header">
        <div class="stat-card-icon ${c.color === 'purple' ? 'purple' : c.color === 'cyan' ? 'cyan' : c.color === 'green' ? 'green' : 'orange'}">
          <i data-lucide="${c.icon}"></i>
        </div>
        <span class="stat-card-trend ${c.up ? 'up' : 'down'}">
          <i data-lucide="${c.up ? 'trending-up' : 'trending-down'}" style="width:12px;height:12px"></i>
          ${c.trend}
        </span>
      </div>
      <div class="stat-card-value">${c.value}</div>
      <div class="stat-card-label">${c.label}</div>
      <div class="stat-card-sparkline">
        ${[40, 55, 45, 70, 60, 80, 65].map(h => `<span style="height:${h}%"></span>`).join('')}
      </div>
    </div>
  `).join('');

  StudyFlowApp.refreshIcons();
}

function renderWeeklyChart() {
  const canvas = document.getElementById('weeklyChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const data = getWeeklyStudyData();
  const isDark = getTheme() === 'dark';

  new Chart(canvas, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Study Hours',
        data: data.data,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: isDark ? '#1e293b' : '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          titleColor: isDark ? '#f1f5f9' : '#0f172a',
          bodyColor: isDark ? '#94a3b8' : '#475569',
          borderColor: isDark ? 'rgba(148,163,184,0.12)' : 'rgba(15,23,42,0.08)',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8
        }
      },
      scales: {
        x: {
          grid: { color: isDark ? 'rgba(148,163,184,0.08)' : 'rgba(15,23,42,0.05)' },
          ticks: { color: isDark ? '#64748b' : '#94a3b8' }
        },
        y: {
          beginAtZero: true,
          grid: { color: isDark ? 'rgba(148,163,184,0.08)' : 'rgba(15,23,42,0.05)' },
          ticks: {
            color: isDark ? '#64748b' : '#94a3b8',
            callback: (v) => v + 'h'
          }
        }
      }
    }
  });
}

function renderUpcomingTasks() {
  const container = document.getElementById('upcomingTasks');
  if (!container) return;

  const assignments = getAssignments()
    .filter(a => !a.completed)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  if (assignments.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding:var(--space-8)">
        <p class="text-muted">No upcoming tasks. Great job!</p>
      </div>`;
    return;
  }

  container.innerHTML = assignments.map(a => `
    <div class="task-item">
      <button class="task-checkbox" data-id="${a.id}" aria-label="Mark ${StudyFlowApp.escapeHtml(a.title)} as complete"></button>
      <div class="task-info">
        <div class="task-title">${StudyFlowApp.escapeHtml(a.title)}</div>
        <div class="task-meta">
          <span>${StudyFlowApp.escapeHtml(a.subject)}</span>
          <span>•</span>
          <span>Due ${formatDate(a.dueDate)}</span>
          ${StudyFlowApp.getPriorityBadge(a.priority)}
        </div>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.task-checkbox').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const assignments = getAssignments();
      const idx = assignments.findIndex(a => a.id === id);
      if (idx !== -1) {
        assignments[idx].completed = true;
        assignments[idx].status = 'completed';
        saveAssignments(assignments);
        StudyFlowApp.showToast('Task marked as complete.', 'success');
        renderUpcomingTasks();
        renderStats();
      }
    });
  });

  StudyFlowApp.refreshIcons();
}

function renderTodaySchedule() {
  const container = document.getElementById('todaySchedule');
  if (!container) return;

  const today = new Date().toISOString().split('T')[0];
  const sessions = getSessions()
    .filter(s => s.date === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  if (sessions.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding:var(--space-8)">
        <p class="text-muted">No sessions scheduled for today.</p>
        <button class="btn btn-primary btn-sm" onclick="StudyFlowApp.openModal('quickSessionModal')" style="margin-top:var(--space-4)">Plan a Session</button>
      </div>`;
    return;
  }

  container.innerHTML = sessions.map(s => `
    <div class="schedule-item">
      <div class="schedule-time">${formatTime(s.startTime)}</div>
      <div class="schedule-info">
        <div class="schedule-subject">${StudyFlowApp.escapeHtml(s.subject)}</div>
        <div class="schedule-duration">${s.duration} min • ${s.type}</div>
      </div>
      <span class="badge badge-primary">${s.type}</span>
    </div>
  `).join('');
}

function renderActivity() {
  const container = document.getElementById('activityList');
  if (!container) return;

  const activities = getActivityFeed();
  const colorMap = {
    green: 'var(--color-success-bg)',
    purple: 'var(--color-accent-muted)',
    cyan: 'var(--color-cyan-muted)',
    orange: 'var(--color-warning-bg)',
    blue: 'var(--color-info-bg)'
  };
  const iconColorMap = {
    green: 'var(--color-success)',
    purple: 'var(--color-accent)',
    cyan: 'var(--color-cyan)',
    orange: 'var(--color-warning)',
    blue: 'var(--color-info)'
  };

  container.innerHTML = activities.map(a => `
    <div class="activity-item">
      <div class="activity-icon" style="background:${colorMap[a.color]};color:${iconColorMap[a.color]}">
        <i data-lucide="${a.icon}"></i>
      </div>
      <div class="activity-content">
        <div class="activity-text">${a.text}</div>
        <div class="activity-time">${a.time}</div>
      </div>
    </div>
  `).join('');

  StudyFlowApp.refreshIcons();
}

function bindQuickActions() {
  document.querySelectorAll('.quick-action-btn[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const modals = { assignment: 'quickAssignmentModal', note: 'quickNoteModal', session: 'quickSessionModal' };
      if (modals[action]) StudyFlowApp.openModal(modals[action]);
    });
  });
}

function bindQuickForms() {
  document.getElementById('quickAssignmentForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    StudyFlowApp.clearFormErrors(form);

    const title = document.getElementById('qaTitle').value.trim();
    const subject = document.getElementById('qaSubject').value.trim();
    const dueDate = document.getElementById('qaDueDate').value;
    const priority = document.getElementById('qaPriority').value;

    let valid = true;
    if (!title) { StudyFlowApp.showFormError(document.getElementById('qaTitle'), 'Title is required'); valid = false; }
    if (!subject) { StudyFlowApp.showFormError(document.getElementById('qaSubject'), 'Subject is required'); valid = false; }
    if (!dueDate) { StudyFlowApp.showFormError(document.getElementById('qaDueDate'), 'Due date is required'); valid = false; }
    if (!valid) return;

    const assignments = getAssignments();
    assignments.push({
      id: StudyFlowStorage.generateId(),
      title, subject, description: '',
      dueDate, priority, status: 'pending',
      completed: false,
      createdAt: new Date().toISOString().split('T')[0]
    });
    saveAssignments(assignments);
    form.reset();
    StudyFlowApp.closeModal('quickAssignmentModal');
    StudyFlowApp.showToast('Assignment added successfully.', 'success');
    renderUpcomingTasks();
    renderStats();
  });

  document.getElementById('quickNoteForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    StudyFlowApp.clearFormErrors(form);

    const title = document.getElementById('qnTitle').value.trim();
    const content = document.getElementById('qnContent').value.trim();
    const category = document.getElementById('qnCategory').value.trim() || 'General';

    let valid = true;
    if (!title) { StudyFlowApp.showFormError(document.getElementById('qnTitle'), 'Title is required'); valid = false; }
    if (!content) { StudyFlowApp.showFormError(document.getElementById('qnContent'), 'Content is required'); valid = false; }
    if (!valid) return;

    const notes = getNotes();
    const now = new Date().toISOString().split('T')[0];
    notes.unshift({
      id: StudyFlowStorage.generateId(),
      title, content, category,
      tags: [], pinned: false,
      createdAt: now, updatedAt: now
    });
    saveNotes(notes);
    form.reset();
    StudyFlowApp.closeModal('quickNoteModal');
    StudyFlowApp.showToast('Note saved successfully.', 'success');
  });

  document.getElementById('quickSessionForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    StudyFlowApp.clearFormErrors(form);

    const subject = document.getElementById('qsSubject').value.trim();
    const date = document.getElementById('qsDate').value;
    const startTime = document.getElementById('qsTime').value;
    const duration = parseInt(document.getElementById('qsDuration').value, 10) || 60;
    const type = document.getElementById('qsType').value;

    let valid = true;
    if (!subject) { StudyFlowApp.showFormError(document.getElementById('qsSubject'), 'Subject is required'); valid = false; }
    if (!date) { StudyFlowApp.showFormError(document.getElementById('qsDate'), 'Date is required'); valid = false; }
    if (!startTime) { StudyFlowApp.showFormError(document.getElementById('qsTime'), 'Start time is required'); valid = false; }
    if (!valid) return;

    const sessions = getSessions();
    sessions.push({
      id: StudyFlowStorage.generateId(),
      subject, date, startTime, duration, type,
      day: getDayName(date)
    });
    saveSessions(sessions);
    form.reset();
    StudyFlowApp.closeModal('quickSessionModal');
    StudyFlowApp.showToast('Study session planned.', 'success');
    renderTodaySchedule();
  });
}

function bindModalCloseButtons() {
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      StudyFlowApp.closeModal(btn.dataset.close);
    });
  });
}
