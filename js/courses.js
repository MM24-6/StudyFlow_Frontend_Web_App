/**
 * StudyFlow — Courses Page
 */

document.addEventListener('DOMContentLoaded', () => {
  bindFilters();
  renderCourses();
  bindModalCloseButtons();
});

function getFilteredCourses() {
  let courses = [...getCourses()];
  const search = document.getElementById('courseSearch')?.value.trim().toLowerCase() || '';
  const sort = document.getElementById('courseSort')?.value || 'name';
  const filter = document.getElementById('courseFilter')?.value || 'all';

  if (search) {
    courses = courses.filter(c =>
      c.name.toLowerCase().includes(search) ||
      c.instructor.toLowerCase().includes(search)
    );
  }

  if (filter === 'high') courses = courses.filter(c => c.progress >= 70);
  else if (filter === 'medium') courses = courses.filter(c => c.progress >= 40 && c.progress < 70);
  else if (filter === 'low') courses = courses.filter(c => c.progress < 40);

  if (sort === 'name') courses.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === 'progress-desc') courses.sort((a, b) => b.progress - a.progress);
  else if (sort === 'progress-asc') courses.sort((a, b) => a.progress - b.progress);

  return courses;
}

function renderCourses() {
  const grid = document.getElementById('courseGrid');
  const empty = document.getElementById('courseEmpty');
  if (!grid) return;

  const courses = getFilteredCourses();

  if (courses.length === 0) {
    grid.innerHTML = '';
    if (empty) empty.style.display = 'block';
    StudyFlowApp.refreshIcons();
    return;
  }

  if (empty) empty.style.display = 'none';

  const iconMap = {
    web: 'code-2',
    db: 'database',
    ml: 'brain',
    net: 'network',
    se: 'layers'
  };

  grid.innerHTML = courses.map(c => `
    <article class="course-card" data-id="${c.id}" tabindex="0" role="button" aria-label="View ${StudyFlowApp.escapeHtml(c.name)} details">
      <div class="course-card-header">
        <div class="course-icon ${c.icon}">
          <i data-lucide="${iconMap[c.icon] || 'book-open'}"></i>
        </div>
        <div>
          <h3 class="course-name">${StudyFlowApp.escapeHtml(c.name)}</h3>
          <p class="course-instructor">${StudyFlowApp.escapeHtml(c.instructor)}</p>
        </div>
      </div>
      <div class="course-progress-section">
        <div class="course-progress-header">
          <span>Progress</span>
          <span class="font-semibold">${c.progress}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill" style="width:${c.progress}%"></div>
        </div>
      </div>
      <div class="course-meta">
        <span>${c.completedModules}/${c.totalModules} modules</span>
        <span>Next: ${StudyFlowApp.escapeHtml(c.nextLesson)}</span>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.course-card').forEach(card => {
    const openDetails = () => showCourseDetails(card.dataset.id);
    card.addEventListener('click', openDetails);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDetails();
      }
    });
  });

  StudyFlowApp.refreshIcons();
}

function showCourseDetails(id) {
  const course = getCourses().find(c => c.id === id);
  if (!course) return;

  document.getElementById('courseModalTitle').textContent = course.name;
  document.getElementById('courseModalBody').innerHTML = `
    <div style="margin-bottom:var(--space-6)">
      <p class="text-muted" style="margin-bottom:var(--space-4)">Instructor: <strong style="color:var(--color-text-primary)">${StudyFlowApp.escapeHtml(course.instructor)}</strong></p>
      <div class="course-progress-section">
        <div class="course-progress-header">
          <span>Overall Progress</span>
          <span class="font-semibold">${course.progress}%</span>
        </div>
        <div class="progress-bar" style="height:12px">
          <div class="progress-bar-fill" style="width:${course.progress}%"></div>
        </div>
      </div>
    </div>
    <div class="grid grid-2" style="gap:var(--space-4)">
      <div class="insight-card">
        <div class="insight-label">Total Modules</div>
        <div class="insight-value">${course.totalModules}</div>
      </div>
      <div class="insight-card">
        <div class="insight-label">Completed</div>
        <div class="insight-value">${course.completedModules}</div>
      </div>
      <div class="insight-card">
        <div class="insight-label">Remaining</div>
        <div class="insight-value">${course.totalModules - course.completedModules}</div>
      </div>
      <div class="insight-card">
        <div class="insight-label">Next Lesson</div>
        <div class="insight-value" style="font-size:var(--font-size-base)">${StudyFlowApp.escapeHtml(course.nextLesson)}</div>
      </div>
    </div>
    <div style="margin-top:var(--space-6)">
      <h4 style="margin-bottom:var(--space-3);font-size:var(--font-size-sm)">Related Assignments</h4>
      ${getAssignments().filter(a => a.subject === course.name).slice(0, 3).map(a => `
        <div class="task-item" style="margin-bottom:var(--space-2)">
          <div class="task-info">
            <div class="task-title ${a.completed ? 'completed' : ''}">${StudyFlowApp.escapeHtml(a.title)}</div>
            <div class="task-meta">Due ${formatDate(a.dueDate)} ${StudyFlowApp.getPriorityBadge(a.priority)}</div>
          </div>
        </div>
      `).join('') || '<p class="text-muted text-sm">No assignments for this course.</p>'}
    </div>
  `;

  StudyFlowApp.openModal('courseModal');
  StudyFlowApp.refreshIcons();
}

function bindFilters() {
  ['courseSearch', 'courseSort', 'courseFilter'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', renderCourses);
    document.getElementById(id)?.addEventListener('change', renderCourses);
  });
}

function bindModalCloseButtons() {
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => StudyFlowApp.closeModal(btn.dataset.close));
  });
}
