(() => {
  const ready = window.supabase && window.UNIFINDEX_SUPABASE_URL && window.UNIFINDEX_SUPABASE_ANON_KEY;
  const accessCard = document.getElementById('accessCard');
  const accessMessage = document.getElementById('accessMessage');
  const signInLink = document.getElementById('signInLink');
  const app = document.getElementById('adminApp');
  const universitiesBody = document.getElementById('universitiesBody');
  const feedbackBody = document.getElementById('feedbackBody');
  const dialog = document.getElementById('universityDialog');
  const form = document.getElementById('universityForm');
  const formStatus = document.getElementById('formStatus');
  let client, universities = [];

  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#039;', '"':'&quot;' }[char]));
  const list = value => value.split(',').map(item => item.trim().toLowerCase()).filter(Boolean);
  const numberOrNull = value => value.trim() === '' ? null : Number(value);
  const emptyRow = (columns, message) => `<tr><td class="empty-row" colspan="${columns}">${message}</td></tr>`;
  const showAccess = (message, showSignIn = false) => { accessCard.hidden = false; app.hidden = true; accessMessage.textContent = message; signInLink.hidden = !showSignIn; };

  async function start() {
    if (!ready) return showAccess('Supabase setup is not configured. Check supabase-config.js.');
    client = window.supabase.createClient(window.UNIFINDEX_SUPABASE_URL, window.UNIFINDEX_SUPABASE_ANON_KEY);
    const { data: { user } } = await client.auth.getUser();
    if (!user) return showAccess('Please sign in with the admin account first.', true);
    const { data: profile, error } = await client.from('profiles').select('display_name, role').eq('id', user.id).maybeSingle();
    if (error || profile?.role !== 'admin') return showAccess('This account does not have administrator access. Ask an existing admin to assign your role.');
    accessCard.hidden = true; app.hidden = false; document.getElementById('signOutButton').hidden = false;
    document.getElementById('adminName').textContent = profile.display_name || user.email.split('@')[0];
    await Promise.all([loadUniversities(), loadFeedback()]);
  }

  async function loadUniversities() {
    const { data, error } = await client.from('universities').select('*').order('name');
    if (error) { universitiesBody.innerHTML = emptyRow(5, escapeHtml(error.message)); return; }
    universities = data || [];
    document.getElementById('universityCount').textContent = universities.length;
    universitiesBody.innerHTML = universities.length ? universities.map(item => `
      <tr><td><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.description || '')}</small></td><td>${escapeHtml((item.types || []).join(', '))}</td><td>${escapeHtml((item.regions || []).join(', '))}</td><td>${item.page_url ? `<a href="${escapeHtml(item.page_url)}" target="_blank" rel="noopener">${escapeHtml(item.page_url)}</a>` : '—'}</td><td><div class="actions"><button class="row-action" data-edit="${item.id}">Edit</button><button class="row-action delete" data-delete-university="${item.id}">Delete</button></div></td></tr>`).join('') : emptyRow(5, 'No admin-managed universities yet. Add your first record.');
  }

  async function loadFeedback() {
    const { data, error } = await client.from('feedback').select('id, reason, message, user_id, created_at').order('created_at', { ascending: false });
    if (error) { feedbackBody.innerHTML = emptyRow(5, escapeHtml(error.message)); return; }
    const feedback = data || [];
    document.getElementById('feedbackCount').textContent = feedback.length;
    feedbackBody.innerHTML = feedback.length ? feedback.map(item => `<tr><td>${escapeHtml(item.reason)}</td><td>${escapeHtml(item.message)}</td><td><code>${escapeHtml(item.user_id)}</code></td><td>${new Date(item.created_at).toLocaleString()}</td><td><button class="row-action delete" data-delete-feedback="${item.id}">Delete</button></td></tr>`).join('') : emptyRow(5, 'No feedback has been submitted yet.');
  }

  function openEditor(record) {
    form.reset(); formStatus.textContent = '';
    document.getElementById('universityId').value = record?.id || '';
    document.getElementById('dialogTitle').textContent = record ? 'Edit university' : 'Add university';
    document.getElementById('universityName').value = record?.name || '';
    document.getElementById('universityTypes').value = (record?.types || []).join(', ');
    document.getElementById('universityRegions').value = (record?.regions || []).join(', ');
    document.getElementById('universityUrl').value = record?.page_url || '';
    document.getElementById('universityImage').value = record?.image_url || '';
    document.getElementById('universityDescription').value = record?.description || '';
    document.getElementById('universityLatitude').value = record?.latitude ?? '';
    document.getElementById('universityLongitude').value = record?.longitude ?? '';
    dialog.showModal();
  }

  form.addEventListener('submit', async event => {
    event.preventDefault(); formStatus.textContent = 'Saving…';
    const id = document.getElementById('universityId').value;
    const record = {
      name: document.getElementById('universityName').value.trim(),
      types: list(document.getElementById('universityTypes').value),
      regions: list(document.getElementById('universityRegions').value),
      page_url: document.getElementById('universityUrl').value.trim() || null,
      image_url: document.getElementById('universityImage').value.trim() || null,
      description: document.getElementById('universityDescription').value.trim() || null,
      latitude: numberOrNull(document.getElementById('universityLatitude').value),
      longitude: numberOrNull(document.getElementById('universityLongitude').value)
    };
    if (!record.types.length || !record.regions.length) { formStatus.textContent = 'Enter at least one type and region.'; return; }
    const { error } = await (id ? client.from('universities').update(record).eq('id', id) : client.from('universities').insert(record));
    if (error) { formStatus.textContent = error.message; return; }
    dialog.close(); await loadUniversities();
  });

  universitiesBody.addEventListener('click', async event => {
    const editId = event.target.dataset.edit, deleteId = event.target.dataset.deleteUniversity;
    if (editId) openEditor(universities.find(item => String(item.id) === editId));
    if (deleteId && confirm('Delete this university record?')) {
      const { error } = await client.from('universities').delete().eq('id', deleteId);
      if (error) alert(error.message); else loadUniversities();
    }
  });
  feedbackBody.addEventListener('click', async event => {
    const id = event.target.dataset.deleteFeedback;
    if (id && confirm('Delete this feedback message?')) {
      const { error } = await client.from('feedback').delete().eq('id', id);
      if (error) alert(error.message); else loadFeedback();
    }
  });
  document.getElementById('newUniversityButton').onclick = () => openEditor();
  document.getElementById('closeDialogButton').onclick = () => dialog.close();
  document.getElementById('cancelDialogButton').onclick = () => dialog.close();
  document.getElementById('refreshFeedbackButton').onclick = loadFeedback;
  document.querySelectorAll('.tab').forEach(tab => tab.onclick = () => {
    document.querySelectorAll('.tab').forEach(item => item.classList.toggle('active', item === tab));
    document.querySelectorAll('.content-panel').forEach(panel => panel.hidden = panel.id !== tab.dataset.panel);
  });
  document.getElementById('signOutButton').onclick = async () => { await client.auth.signOut(); window.location.reload(); };
  start().catch(error => showAccess(`Unable to verify access: ${error.message}`, true));
})();
