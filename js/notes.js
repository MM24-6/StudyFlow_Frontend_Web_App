/** StudyFlow — Notes Page */
let editingNoteId = null;

document.addEventListener('DOMContentLoaded', () => {
  bindFilters();
  bindButtons();
  bindForm();
  bindModalCloseButtons();
  renderNotes();
});

function getFilteredNotes() {
  const search = document.getElementById('noteSearch')?.value.trim().toLowerCase() || '';
  const category = document.getElementById('categoryFilter')?.value || 'all';
  let notes = [...getNotes()];
  if (search) notes = notes.filter(n => [n.title,n.content,n.category,(n.tags||[]).join(' ')].join(' ').toLowerCase().includes(search));
  if (category !== 'all') notes = notes.filter(n => n.category === category);
  return notes.sort((a,b) => Number(b.pinned)-Number(a.pinned) || b.updatedAt.localeCompare(a.updatedAt));
}

function populateCategories() {
  const select=document.getElementById('categoryFilter'); if(!select) return;
  const current=select.value;
  const categories=[...new Set(getNotes().map(n=>n.category).filter(Boolean))].sort();
  select.innerHTML='<option value="all">All Categories</option>'+categories.map(c=>`<option value="${StudyFlowApp.escapeHtml(c)}">${StudyFlowApp.escapeHtml(c)}</option>`).join('');
  select.value=categories.includes(current)?current:'all';
}

function noteCard(note) {
  const tags=(note.tags||[]).map(t=>`<span class="note-tag">${StudyFlowApp.escapeHtml(t)}</span>`).join('');
  return `<article class="note-card ${note.pinned?'pinned':''}">
    <div class="note-card-header">
      <div><h3 class="note-title">${StudyFlowApp.escapeHtml(note.title)}</h3><div class="note-category text-muted">${StudyFlowApp.escapeHtml(note.category||'General')}</div></div>
      <button class="btn btn-ghost btn-sm" data-pin="${note.id}" aria-label="${note.pinned?'Unpin':'Pin'} note"><i data-lucide="pin" class="note-pin" style="width:16px;height:16px"></i></button>
    </div>
    <p class="note-content">${StudyFlowApp.escapeHtml(note.content)}</p>
    <div class="note-tags">${tags}</div>
    <div class="note-footer">
      <span class="text-muted text-xs">Updated ${formatDate(note.updatedAt)}</span>
      <div class="flex gap-2">
        <button class="btn btn-ghost btn-sm" data-edit="${note.id}" aria-label="Edit note"><i data-lucide="pencil" style="width:15px;height:15px"></i></button>
        <button class="btn btn-ghost btn-sm" data-delete="${note.id}" aria-label="Delete note"><i data-lucide="trash-2" style="width:15px;height:15px"></i></button>
      </div>
    </div>
  </article>`;
}

function renderNotes(){
  populateCategories();
  const notes=getFilteredNotes(); const pinned=notes.filter(n=>n.pinned); const regular=notes.filter(n=>!n.pinned);
  const pinnedSection=document.getElementById('pinnedSection'), pinnedGrid=document.getElementById('pinnedNotes'), grid=document.getElementById('notesGrid'), recent=document.getElementById('recentSection'), empty=document.getElementById('notesEmpty');
  if(!notes.length){ pinnedSection.style.display='none'; recent.style.display='none'; empty.style.display='block'; }
  else { empty.style.display='none'; recent.style.display='block'; pinnedSection.style.display=pinned.length?'block':'none'; pinnedGrid.innerHTML=pinned.map(noteCard).join(''); grid.innerHTML=regular.map(noteCard).join('') || '<p class="text-muted text-sm">No other notes match your filters.</p>'; }
  document.querySelectorAll('[data-pin]').forEach(b=>b.onclick=()=>togglePin(b.dataset.pin));
  document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>openEdit(b.dataset.edit));
  document.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>deleteNote(b.dataset.delete));
  StudyFlowApp.refreshIcons();
}
function openAdd(){ editingNoteId=null; document.getElementById('noteModalTitle').textContent='Add Note'; document.getElementById('noteSubmitBtn').textContent='Save Note'; document.getElementById('noteForm').reset(); document.getElementById('noteId').value=''; StudyFlowApp.clearFormErrors(document.getElementById('noteForm')); StudyFlowApp.openModal('noteModal'); }
function openEdit(id){ const n=getNotes().find(x=>x.id===id); if(!n)return; editingNoteId=id; document.getElementById('noteModalTitle').textContent='Edit Note'; document.getElementById('noteSubmitBtn').textContent='Save Changes'; document.getElementById('noteId').value=id; document.getElementById('noteTitle').value=n.title; document.getElementById('noteContent').value=n.content; document.getElementById('noteCategory').value=n.category||'General'; document.getElementById('noteTags').value=(n.tags||[]).join(', '); document.getElementById('notePinned').checked=!!n.pinned; StudyFlowApp.clearFormErrors(document.getElementById('noteForm')); StudyFlowApp.openModal('noteModal'); }
function togglePin(id){ const notes=getNotes(); const n=notes.find(x=>x.id===id); if(!n)return; n.pinned=!n.pinned; n.updatedAt=new Date().toISOString().split('T')[0]; saveNotes(notes); StudyFlowApp.showToast(n.pinned?'Note pinned.':'Note unpinned.','success'); renderNotes(); }
function deleteNote(id){ const n=getNotes().find(x=>x.id===id); if(!n)return; if(!StudyFlowApp.confirmAction(`Delete "${n.title}"? This action cannot be undone.`))return; saveNotes(getNotes().filter(x=>x.id!==id)); StudyFlowApp.showToast('Note deleted.','success'); renderNotes(); }
function bindFilters(){ ['noteSearch','categoryFilter'].forEach(id=>document.getElementById(id)?.addEventListener('input',renderNotes)); }
function bindButtons(){ document.getElementById('addNoteBtn')?.addEventListener('click',openAdd); document.getElementById('emptyNoteBtn')?.addEventListener('click',openAdd); }
function bindModalCloseButtons(){ document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>StudyFlowApp.closeModal(b.dataset.close))); }
function bindForm(){ document.getElementById('noteForm')?.addEventListener('submit',e=>{ e.preventDefault(); const form=e.target; StudyFlowApp.clearFormErrors(form); const title=document.getElementById('noteTitle').value.trim(), content=document.getElementById('noteContent').value.trim(), category=document.getElementById('noteCategory').value.trim()||'General', tags=document.getElementById('noteTags').value.split(',').map(x=>x.trim()).filter(Boolean), pinned=document.getElementById('notePinned').checked; let ok=true; if(!title){StudyFlowApp.showFormError(document.getElementById('noteTitle'),'Title is required');ok=false;} if(!content){StudyFlowApp.showFormError(document.getElementById('noteContent'),'Content is required');ok=false;} if(!ok)return; const notes=getNotes(); const today=new Date().toISOString().split('T')[0]; if(editingNoteId){const n=notes.find(x=>x.id===editingNoteId); Object.assign(n,{title,content,category,tags,pinned,updatedAt:today}); StudyFlowApp.showToast('Note updated.','success');}else{notes.unshift({id:StudyFlowStorage.generateId(),title,content,category,tags,pinned,createdAt:today,updatedAt:today});StudyFlowApp.showToast('Note saved.','success');} saveNotes(notes); StudyFlowApp.closeModal('noteModal'); renderNotes(); }); }
