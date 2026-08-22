/**
 * StudyFlow — Assignments Page
 */

let editingId = null;

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const searchParam = params.get('search');
  if (searchParam) {
    const searchInput = document.getElementById('assignmentSearch');
    if (searchInput) searchInput.value = searchParam;
  }

  renderAssignments();
  bindFilters();
  bindForm();
  bindButtons();
  bindModalCloseButtons();
});

function getFilteredAssignments() {
  let items = [...getAssignments()];
  const search = document.getElementById('assignmentSearch')?.value.trim().toLowerCase() || '';
  const status = document.getElementById('statusFilter')?.value || 'all';
  const priority = document.getElementById('priorityFilter')?.value || 'all';
  const sort = document.getElementById('sortFilter')?.value || 'due-asc';

  if (search) {
    items = items.filter(a =>
      a.title.toLowerCase().includes(search) ||
      a.subject.toLowerCase().includes(search) ||
      (a.description && a.description.toLowerCase().includes(search))
    );
  }

  if (status !== 'all') items = items.filter(a => a.status === status);
  if (priority !== 'all') items = items.filter(a => a.priority === priority);

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  if (sort === 'due-asc') items.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  else if (sort === 'due-desc') items.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
  else if (sort === 'priority') items.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  else if (sort === 'title') items.sort((a, b) => a.title.localeCompare(b.title));

  return items;
}

function renderAssignments() {
  const list = document.getElementById('assignmentList');
  const empty = document.getElementById('assignmentEmpty');
  if (!list) return;

  const items = getFilteredAssignments();
  const totalItems = getAssignments().length;

  if (items.length === 0) {
    list.innerHTML = '';
    if (empty) {
      empty.style.display = 'block';
      const msg = document.getElementById('emptyMessage');
      if (msg) {
        msg.textContent = totalItems === 0
          ? 'Create your first assignment to get started.'
          : 'No assignments match your search or filters.';
      }
    }
    StudyFlowApp.refreshIcons();
    return;
  }

  if (empty) empty.style.display = 'none';

  list.innerHTML = items.map(a => `
    <div class="task-item" data-id="${a.id}">
      <button class="task-checkbox ${a.completed ? 'checked' : ''}" data-action="complete" data-id="${a.id}" aria-label="${a.completed ? 'Mark incomplete' : 'Mark complete'}">
        ${a.completed ? '<i data-lucide="check" style="width:14px;height:14px"></i>' : ''}
      </button>
      <div class="task-info">
        <div class="task-title ${a.completed ? 'completed' : ''}">${StudyFlowApp.escapeHtml(a.title)}</div>
        <div class="task-meta">
          <span>${StudyFlowApp.escapeHtml(a.subject)}</span>
          <span>•</span>
          <span>Due ${formatDate(a.dueDate)}</span>
          ${StudyFlowApp.getPriorityBadge(a.priority)}
          ${StudyFlowApp.getStatusBadge(a.status)}
        </div>
        ${a.description ? `<p class="text-sm text-muted" style="margin-top:var(--space-2)">${StudyFlowApp.escapeHtml(a.description)}</p>` : ''}
      </div>
      <div class="task-actions">
        <button class="btn btn-ghost btn-icon btn-sm" data-action="edit" data-id="${a.id}" aria-label="Edit assignment">
          <i data-lucide="pencil"></i>
        </button>
        <button class="btn btn-ghost btn-icon btn-sm" data-action="delete" data-id="${a.id}" aria-label="Delete assignment">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const { action, id } = btn.dataset;
      if (action === 'complete') toggleComplete(id);
      else if (action === 'edit') openEditModal(id);
      else if (action === 'delete') deleteAssignment(id);
    });
  });

  StudyFlowApp.refreshIcons();
}

function toggleComplete(id) {
  const assignments = getAssignments();
  const idx = assignments.findIndex(a => a.id === id);
  if (idx === -1) return;

  assignments[idx].completed = !assignments[idx].completed;
  assignments[idx].status = assignments[idx].completed ? 'completed' : 'pending';
  saveAssignments(assignments);
  StudyFlowApp.showToast(
    assignments[idx].completed ? 'Task marked as complete.' : 'Task marked as incomplete.',
    'success'
  );
  renderAssignments();
}

function openAddModal() {
  editingId = null;
  document.getElementById('assignmentModalTitle').textContent = 'Add Assignment';
  document.getElementById('assignmentSubmitBtn').textContent = 'Add Assignment';
  document.getElementById('assignmentForm').reset();
  document.getElementById('assignmentId').value = '';
  StudyFlowApp.clearFormErrors(document.getElementById('assignmentForm'));
  StudyFlowApp.openModal('assignmentModal');
}

function openEditModal(id) {
  const assignment = getAssignments().find(a => a.id === id);
  if (!assignment) return;

  editingId = id;
  document.getElementById('assignmentModalTitle').textContent = 'Edit Assignment';
  document.getElementById('assignmentSubmitBtn').textContent = 'Save Changes';
  document.getElementById('assignmentId').value = id;
  document.getElementById('assignTitle').value = assignment.title;
  document.getElementById('assignSubject').value = assignment.subject;
  document.getElementById('assignDescription').value = assignment.description || '';
  document.getElementById('assignDueDate').value = assignment.dueDate;
  document.getElementById('assignPriority').value = assignment.priority;
  document.getElementById('assignStatus').value = assignment.status;
  StudyFlowApp.clearFormErrors(document.getElementById('assignmentForm'));
  StudyFlowApp.openModal('assignmentModal');
}

function deleteAssignment(id) {
  const assignment = getAssignments().find(a => a.id === id);
  if (!assignment) return;

  if (!StudyFlowApp.confirmAction(`Delete "${assignment.title}"? This action cannot be undone.`)) return;

  const assignments = getAssignments().filter(a => a.id !== id);
  saveAssignments(assignments);
  StudyFlowApp.showToast('Assignment deleted.', 'success');
  renderAssignments();
}

function bindForm() {
  document.getElementById('assignmentForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    StudyFlowApp.clearFormErrors(form);

    const title = document.getElementById('assignTitle').value.trim();
    const subject = document.getElementById('assignSubject').value.trim();
    const description = document.getElementById('assignDescription').value.trim();
    const dueDate = document.getElementById('assignDueDate').value;
    const priority = document.getElementById('assignPriority').value;
    const status = document.getElementById('assignStatus').value;

    let valid = true;
    if (!title) { StudyFlowApp.showFormError(document.getElementById('assignTitle'), 'Title is required'); valid = false; }
    if (!subject) { StudyFlowApp.showFormError(document.getElementById('assignSubject'), 'Subject is required'); valid = false; }
    if (!dueDate) { StudyFlowApp.showFormError(document.getElementById('assignDueDate'), 'Due date is required'); valid = false; }
    else {
      const due = new Date(dueDate + 'T00:00:00');
      const minDate = new Date('2020-01-01');
      if (due < minDate) {
        StudyFlowApp.showFormError(document.getElementById('assignDueDate'), 'Please enter a valid date');
        valid = false;
      }
    }
    if (!valid) return;

    const assignments = getAssignments();
    const completed = status === 'completed';

    if (editingId) {
      const idx = assignments.findIndex(a => a.id === editingId);
      if (idx !== -1) {
        assignments[idx] = { ...assignments[idx], title, subject, description, dueDate, priority, status, completed };
      }
      StudyFlowApp.showToast('Changes saved.', 'success');
    } else {
      assignments.push({
        id: StudyFlowStorage.generateId(),
        title, subject, description, dueDate, priority, status, completed,
        createdAt: new Date().toISOString().split('T')[0]
      });
      StudyFlowApp.showToast('Assignment added successfully.', 'success');
    }

    saveAssignments(assignments);
    StudyFlowApp.closeModal('assignmentModal');
    renderAssignments();
  });
}

function bindFilters() {
  ['assignmentSearch', 'statusFilter', 'priorityFilter', 'sortFilter'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', renderAssignments);
    document.getElementById(id)?.addEventListener('change', renderAssignments);
  });
}

function bindButtons() {
  document.getElementById('addAssignmentBtn')?.addEventListener('click', openAddModal);
  document.getElementById('emptyAddBtn')?.addEventListener('click', openAddModal);
}

function bindModalCloseButtons() {
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => StudyFlowApp.closeModal(btn.dataset.close));
  });
}
