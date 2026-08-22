(() => {
  const button = document.getElementById('accountButton');
  if (!button || document.getElementById('accountModal')) return;

  const style = document.createElement('style');
  style.textContent = `
    .account-button { display:inline-flex; align-items:center; gap:8px; min-height:38px; padding:0 14px; border:1px solid var(--border, #dce5f2); border-radius:10px; background:var(--surface, #fff); color:var(--text, #132238); font:inherit; font-size:.88rem; font-weight:700; cursor:pointer; }
    .account-button:hover { border-color:var(--primary, #1d4ed8); }
    .account-icon { color:var(--primary, #1d4ed8); }
    .account-modal { display:none; position:fixed; inset:0; z-index:1000; align-items:center; justify-content:center; padding:20px; }
    .account-modal.is-open { display:flex; }
    .account-modal-backdrop { position:absolute; inset:0; background:rgba(3,10,18,.68); backdrop-filter:blur(5px); }
    .account-dialog { position:relative; width:min(100%,430px); padding:32px; border:1px solid var(--border,#dce5f2); border-radius:18px; background:var(--surface,#fff); color:var(--text,#132238); box-shadow:0 24px 80px rgba(0,0,0,.3); }
    .account-close { position:absolute; top:12px; right:14px; border:0; background:transparent; color:var(--muted,#667085); font-size:1.8rem; cursor:pointer; }
    .account-kicker { color:var(--primary,#1d4ed8); font-size:.72rem; font-weight:800; letter-spacing:.14em; }
    .account-dialog h2 { margin:9px 0 8px; font-size:1.55rem; }
    .account-dialog-copy { margin:0 0 22px; color:var(--muted,#667085); line-height:1.55; }
    .account-tabs { display:grid; grid-template-columns:1fr 1fr; gap:4px; padding:4px; margin-bottom:22px; border-radius:10px; background:var(--surface-2,#f2f6ff); }
    .account-tab { padding:10px 8px; border:0; border-radius:7px; background:transparent; color:var(--muted,#667085); font:inherit; font-weight:700; cursor:pointer; }
    .account-tab.active { background:var(--surface,#fff); color:var(--text,#132238); }
    .account-form label { display:block; margin:13px 0 7px; font-size:.86rem; }
    .account-form input { width:100%; padding:12px 13px; border:1px solid var(--border,#dce5f2); border-radius:9px; background:var(--input-bg,#fcfdff); color:var(--input-text,#132238); font:inherit; }
    .account-submit { width:100%; margin-top:20px; padding:13px; border:0; border-radius:9px; background:var(--primary,#1d4ed8); color:#fff; font:inherit; font-weight:800; cursor:pointer; }
    .account-status { min-height:20px; margin:11px 0 0; color:var(--primary,#1d4ed8); font-size:.82rem; text-align:center; }
    body.account-modal-open { overflow:hidden; }
    @media (max-width:720px) { .topbar-note { display:none; } .account-button { padding:0 11px; } }
  `;
  document.head.appendChild(style);

  document.body.insertAdjacentHTML('beforeend', `
    <div class="account-modal" id="accountModal" aria-hidden="true">
      <div class="account-modal-backdrop" data-close-account></div>
      <section class="account-dialog" role="dialog" aria-modal="true" aria-labelledby="accountDialogTitle">
        <button type="button" class="account-close" data-close-account aria-label="ပိတ်ရန်">&times;</button>
        <div class="account-kicker">UNIFINDEX ACCOUNT</div>
        <h2 id="accountDialogTitle">သင့်အကောင့်သို့ ဝင်ရောက်ပါ</h2>
        <p class="account-dialog-copy">သိမ်းဆည်းထားသော တက္ကသိုလ်များကို တစ်နေရာတည်းတွင် ကြည့်ရှုနိုင်ပါသည်။</p>
        <div class="account-tabs"><button type="button" class="account-tab active" data-account-mode="signin">Sign in</button><button type="button" class="account-tab" data-account-mode="signup">Create account</button></div>
        <form class="account-form" id="accountForm"><label for="accountEmail">Email</label><input id="accountEmail" type="email" required autocomplete="email" placeholder="you@example.com"><label for="accountPassword">Password</label><input id="accountPassword" type="password" required minlength="6" autocomplete="current-password" placeholder="Password"><div id="accountConfirmField" hidden><label for="accountConfirmPassword">Confirm password</label><input id="accountConfirmPassword" type="password" minlength="6" autocomplete="new-password" placeholder="Confirm password"></div><button class="account-submit" type="submit" id="accountSubmit">Sign in <span aria-hidden="true">→</span></button><p class="account-status" id="accountStatus" role="status"></p></form>
      </section>
    </div>`);

  const modal = document.getElementById('accountModal');
  const label = document.getElementById('accountButtonLabel');
  const form = document.getElementById('accountForm');
  const confirmField = document.getElementById('accountConfirmField');
  const confirmPassword = document.getElementById('accountConfirmPassword');
  const status = document.getElementById('accountStatus');
  let mode = 'signin';

  const setMode = nextMode => {
    mode = nextMode;
    document.querySelectorAll('[data-account-mode]').forEach(tab => tab.classList.toggle('active', tab.dataset.accountMode === mode));
    confirmField.hidden = mode !== 'signup';
    confirmPassword.required = mode === 'signup';
    document.getElementById('accountSubmit').innerHTML = `${mode === 'signup' ? 'Create account' : 'Sign in'} <span aria-hidden="true">→</span>`;
    status.textContent = '';
  };
  const setOpen = open => { modal.classList.toggle('is-open', open); modal.setAttribute('aria-hidden', String(!open)); document.body.classList.toggle('account-modal-open', open); };

  button.addEventListener('click', () => {
    if (localStorage.getItem('demoAccountSignedIn') === 'true') { localStorage.removeItem('demoAccountSignedIn'); label.textContent = 'Sign in'; return; }
    setMode('signin'); setOpen(true);
  });
  modal.querySelectorAll('[data-close-account]').forEach(element => element.addEventListener('click', () => setOpen(false)));
  modal.querySelectorAll('[data-account-mode]').forEach(tab => tab.addEventListener('click', () => setMode(tab.dataset.accountMode)));
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (mode === 'signup' && confirmPassword.value !== document.getElementById('accountPassword').value) { status.textContent = 'Passwords do not match.'; return; }
    localStorage.setItem('demoAccountSignedIn', 'true'); label.textContent = 'Sign out'; status.textContent = mode === 'signup' ? 'Account created for this demo.' : 'Signed in for this demo.'; setTimeout(() => setOpen(false), 700);
  });
  if (localStorage.getItem('demoAccountSignedIn') === 'true') label.textContent = 'Sign out';
})();
