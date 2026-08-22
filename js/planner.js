/**
 * StudyFlow — Study Planner Page
 */

document.addEventListener('DOMContentLoaded', () => {
  renderPlanner();
  bindForm();
  bindButtons();
  bindModalCloseButtons();
});

function renderPlanner() {
  const grid = document.getElementById('plannerGrid');
  const empty = document.getElementById('plannerEmpty');
  if (!grid) return;

  const days = getDaysOfWeek();
  const sessions = getSessions();
  const weekDates = days.map(d => d.date);
  const weekSessions = sessions.filter(s => weekDates.includes(s.date));

  if (weekSessions.length === 0 && sessions.length === 0) {
    grid.style.display = 'none';
    if (empty) empty.style.display = 'block';
    StudyFlowApp.refreshIcons();
    return;
  }

  grid.style.display = 'grid';
  if (empty) empty.style.display = weekSessions.length === 0 ? 'block' : 'none';

  grid.innerHTML = days.map(day => {
    const daySessions = sessions
      .filter(s => s.date === day.date)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    return `
      <div class="planner-day ${day.isToday ? 'today' : ''}">
        <div class="planner-day-header">
          <div class="planner-day-name">${day.name}</div>
          <div class="planner-day-date">${new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
        </div>
        <div class="planner-day-body">
          ${daySessions.length === 0
            ? '<p class="text-muted text-sm text-center" style="padding:var(--space-4)">No sessions</p>'
            : daySessions.map(s => `
              <div class="planner-session">
                <div class="planner-session-subject">${StudyFlowApp.escapeHtml(s.subject)}</div>
                <div class="planner-session-time">${formatTime(s.startTime)} • ${s.duration}min • ${s.type}</div>
                <div class="planner-session-actions">
                  <button class="btn btn-ghost btn-sm" data-delete="${s.id}" aria-label="Delete session">
                    <i data-lucide="trash-2" style="width:14px;height:14px"></i>
                  </button>
                </div>
              </div>
            `).join('')}
        </div>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', () => deleteSession(btn.dataset.delete));
  });

  StudyFlowApp.refreshIcons();
}

function deleteSession(id) {
  if (!StudyFlowApp.confirmAction('Delete this study session?')) return;

  const sessions = getSessions().filter(s => s.id !== id);
  saveSessions(sessions);
  StudyFlowApp.showToast('Study session removed.', 'success');
  renderPlanner();
}

function bindForm() {
  document.getElementById('sessionForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    StudyFlowApp.clearFormErrors(form);

    const subject = document.getElementById('sessionSubject').value.trim();
    const date = document.getElementById('sessionDate').value;
    const startTime = document.getElementById('sessionTime').value;
    const duration = parseInt(document.getElementById('sessionDuration').value, 10) || 60;
    const type = document.getElementById('sessionType').value;

    let valid = true;
    if (!subject) { StudyFlowApp.showFormError(document.getElementById('sessionSubject'), 'Subject is required'); valid = false; }
    if (!date) { StudyFlowApp.showFormError(document.getElementById('sessionDate'), 'Date is required'); valid = false; }
    if (!startTime) { StudyFlowApp.showFormError(document.getElementById('sessionTime'), 'Start time is required'); valid = false; }
    if (duration < 15 || duration > 480) {
      StudyFlowApp.showFormError(document.getElementById('sessionDuration'), 'Duration must be between 15 and 480 minutes');
      valid = false;
    }
    if (!valid) return;

    const sessions = getSessions();
    sessions.push({
      id: StudyFlowStorage.generateId(),
      subject, date, startTime, duration, type,
      day: getDayName(date)
    });
    saveSessions(sessions);
    form.reset();
    StudyFlowApp.closeModal('sessionModal');
    StudyFlowApp.showToast('Study session planned.', 'success');
    renderPlanner();
  });
}

function bindButtons() {
  const openModal = () => {
    document.getElementById('sessionForm')?.reset();
    StudyFlowApp.clearFormErrors(document.getElementById('sessionForm'));
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('sessionDate').value = today;
    StudyFlowApp.openModal('sessionModal');
  };

  document.getElementById('addSessionBtn')?.addEventListener('click', openModal);
  document.getElementById('emptySessionBtn')?.addEventListener('click', openModal);
}

function bindModalCloseButtons() {
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => StudyFlowApp.closeModal(btn.dataset.close));
  });
}
