(() => {
  const button = document.getElementById('accountButton');
  if (!button || document.getElementById('accountModal')) return;

  let supabaseClient;

  const getSupabaseClient = () => {
    const url = window.UNIFINDEX_SUPABASE_URL;
    const anonKey = window.UNIFINDEX_SUPABASE_ANON_KEY;
    if (!url || !anonKey || url.includes('PASTE_') || anonKey.includes('PASTE_')) {
      throw new Error('Supabase is not configured yet.');
    }
    if (!window.supabase) {
      throw new Error('Supabase library could not be loaded.');
    }
    supabaseClient ||= window.supabase.createClient(url, anonKey);
    return supabaseClient;
  };

  const getCurrentUser = async () => {
    try {
      const { data: { user } } = await getSupabaseClient().auth.getUser();
      return user;
    } catch {
      return null;
    }
  };

  window.unifindexAuth = { getCurrentUser };

  const style = document.createElement('style');
  style.textContent = `
    .account-button { display:inline-flex; align-items:center; justify-content:center; min-height:38px; padding:0 14px; border:1px solid #dce5f2; border-radius:8px; background:#fff; color:#132238; font:inherit; font-size:.88rem; font-weight:700; cursor:pointer; }
    .account-button:hover { border-color:#3b82f6; }
    
    .account-user-wrapper { position:relative; display:inline-block; }
    .account-profile-btn { display:inline-flex; align-items:center; justify-content:center; padding:3px; border:1px solid #dce5f2; border-radius:50%; background:#fff; cursor:pointer; transition:border-color .2s; }
    .account-profile-btn:hover { border-color:#3b82f6; background:#f8fafc; }
    .account-avatar-img { width:32px; height:32px; border-radius:50%; object-fit:cover; display:block; }
    .account-avatar-fallback { width:32px; height:32px; border-radius:50%; background:#3b82f6; color:#fff; display:grid; place-items:center; font-weight:bold; font-size:.9rem; }

    .account-dropdown-menu { display:none; position:absolute; right:0; top:calc(100% + 8px); width:220px; background:#fff; border:1px solid #e2e8f0; border-radius:12px; box-shadow:0 10px 25px rgba(0,0,0,0.1); z-index:1100; overflow:hidden; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    .account-dropdown-menu.is-open { display:block; }
    .account-dropdown-header { padding:14px 16px; border-bottom:1px solid #f1f5f9; background:#f8fafc; }
    .account-dropdown-email { font-size:0.82rem; color:#64748b; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .account-dropdown-item { display:block; width:100%; padding:10px 16px; border:none; background:none; text-align:left; font:inherit; font-size:0.88rem; color:#334155; cursor:pointer; text-decoration:none; }
    .account-dropdown-item:hover { background:#f1f5f9; color:#1e293b; }
    .account-dropdown-divider { height:1px; background:#f1f5f9; margin:4px 0; }

    .account-modal { display:none; position:fixed; inset:0; z-index:1000; align-items:center; justify-content:center; padding:16px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    .account-modal.is-open { display:flex; pointer-events:auto; }
    .account-modal-backdrop { position:absolute; inset:0; z-index:0; background:rgba(0,0,0,0.5); backdrop-filter:blur(2px); }
    
    .account-dialog { position:relative; z-index:1; width:min(100%, 420px); max-height:90vh; overflow-y:auto; padding:30px 24px; border:none; border-radius:12px; background:#fff; color:#333; box-shadow:0 8px 32px rgba(0,0,0,0.2); box-sizing:border-box; pointer-events:auto; touch-action:auto; -webkit-overflow-scrolling:touch; }
    .account-close { position:absolute; top:16px; right:16px; border:0; background:transparent; color:#777; font-size:1.6rem; cursor:pointer; font-weight:300; }
    .account-close:hover { color:#000; }
    
    .account-dialog h2 { margin:0 0 6px; font-size:1.8rem; font-weight:700; text-align:center; color:#3b82f6; }
    .account-dialog-copy { margin:0 0 20px; color:#666; font-size:0.9rem; text-align:center; }
    .account-switch-text { text-align:center; margin:0 0 20px; font-size:0.9rem; color:#555; }
    .account-switch-link { color:#3b82f6; font-weight:600; text-decoration:none; cursor:pointer; }
    .account-switch-link:hover { text-decoration:underline; }

    .account-social { display:grid; grid-template-columns: repeat(4, 1fr); gap:10px; margin-bottom:20px; }
    .account-social-button { display:flex; align-items:center; justify-content:center; height:45px; border:1px solid #dedede; border-radius:8px; background:#fff; cursor:pointer; transition:border-color .2s, background .2s; }
    .account-social-button:hover { border-color:#3b82f6; background:#fcfcfc; }
    .account-social-icon { width:20px; height:20px; display:inline-flex; align-items:center; justify-content:center; }
    .account-social-icon svg { width:100%; height:100%; }

    .account-divider { display:flex; align-items:center; gap:10px; margin:0 0 20px; color:#888; font-size:.85rem; text-align:center; }
    .account-divider::before, .account-divider::after { content:""; height:1px; flex:1; background:#e0e0e0; }

    .account-form .input-group { position:relative; margin-bottom:15px; }
    .account-form label { display:block; margin:0 0 6px; font-size:.88rem; font-weight:600; color:#333; }
    .account-form input[type="email"],
    .account-form input[type="text"],
    .account-form input[type="password"] { width:100%; min-height:46px; padding:12px 50px 12px 14px; border:1px solid #ccc; border-radius:8px; background:#fff; color:#333; font:inherit; font-size:16px; box-sizing:border-box; transition:border-color .2s; pointer-events:auto; touch-action:auto; -webkit-user-select:text; user-select:text; }
    .account-form input[type="email"], .account-form input[type="text"] { min-height:46px; font-size:16px; pointer-events:auto; touch-action:auto; -webkit-user-select:text; user-select:text; }
    .account-form input:focus { outline:none; border-color:#3b82f6; }
    
    .password-toggle { position:absolute; z-index:2; right:8px; top:32px; min-width:48px; height:40px; padding:0 8px; border-radius:8px; background:transparent; border:none; cursor:pointer; color:#2563eb; font:inherit; font-size:.78rem; font-weight:700; pointer-events:auto; touch-action:auto; }
    .account-options { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; font-size:0.88rem; }
    .account-options a { color:#3b82f6; text-decoration:none; }
    .account-options a:hover { text-decoration:underline; }
    
    .checkbox-label { display:flex; align-items:center; gap:8px; font-size:0.86rem; color:#444; cursor:pointer; }
    .checkbox-label input { width:16px; height:16px; accent-color:#3b82f6; cursor:pointer; }

    .terms-text { font-size:0.78rem; color:#666; margin:15px 0; line-height:1.4; text-align:left; }
    .terms-text a { color:#3b82f6; text-decoration:underline; }
    .recaptcha-notice { font-size:0.72rem; color:#777; text-align:center; margin-top:15px; line-height:1.3; }
    .recaptcha-notice a { color:#555; text-decoration:underline; }

    .account-submit { width:100%; height:46px; margin-top:5px; border:0; border-radius:8px; background:#3b82f6; color:#fff; font:inherit; font-size:1rem; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; transition:background .2s; }
    .account-submit:hover { background:#2563eb; }
    .account-status { min-height:20px; margin:12px 0 0; color:#3b82f6; font-size:.9rem; text-align:center; font-weight:600; }
    body.account-modal-open { overflow:hidden; }
    
    @media (max-width:720px) { 
      .account-modal { align-items:flex-start; overflow-y:auto; padding:12px; }
      .account-dialog { width:100%; max-height:none; margin:auto 0; padding:20px 16px; } 
      .account-form input[type="email"], .account-form input[type="text"], .account-form input[type="password"] { font-size:16px; }
    }
  `;
  document.head.appendChild(style);

  const parentContainer = button.parentNode;
  const wrapper = document.createElement('div');
  wrapper.className = 'account-user-wrapper';
  parentContainer.replaceChild(wrapper, button);
  wrapper.appendChild(button);

  const dropdownMenu = document.createElement('div');
  dropdownMenu.className = 'account-dropdown-menu';
  dropdownMenu.innerHTML = `
    <div class="account-dropdown-header">
      <div style="font-weight:600; font-size:0.88rem; color:#1e293b;" id="dropUserName">Account</div>
      <div class="account-dropdown-email" id="dropUserEmail"></div>
    </div>
    <button type="button" class="account-dropdown-item" id="switchAccountBtn">Switch Account</button>
    <div class="account-dropdown-divider"></div>
    <button type="button" class="account-dropdown-item" id="logoutBtn" style="color:#ef4444;">Log Out</button>
  `;
  wrapper.appendChild(dropdownMenu);

  document.body.insertAdjacentHTML('beforeend', `
    <div class="account-modal" id="accountModal" aria-hidden="true">
      <div class="account-modal-backdrop" data-close-account></div>
      <section class="account-dialog" role="dialog" aria-modal="true" aria-labelledby="accountDialogTitle">
        <button type="button" class="account-close" data-close-account aria-label="ပိတ်ရန်">&times;</button>
        
        <h2 id="accountDialogTitle">Sign in</h2>
        <p class="account-dialog-copy" id="accountDialogSub">Get access to more learning features</p>
        
        <div class="account-switch-text" id="accountSwitchContainer">
          Don't have an account? <a href="#" class="account-switch-link" data-account-mode="signup">Register</a>
        </div>

        <div class="account-social" aria-label="Social Sign-in">
          <button type="button" class="account-social-button" data-social-provider="google" title="Sign in with Google">
            <span class="account-social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.19v3.15C3.18 21.34 7.22 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.19C.43 8.13 0 9.84 0 12s.43 3.87 1.19 5.39l4.08-3.15z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.22 0 3.18 2.66 1.19 6.61l4.08 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>
            </span>
          </button>
          <button type="button" class="account-social-button" data-social-provider="facebook" title="Sign in with Facebook">
            <span class="account-social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </span>
          </button>
          <button type="button" class="account-social-button" data-social-provider="github" title="Sign in with GitHub">
            <span class="account-social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#181717"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </span>
          </button>
          <button type="button" class="account-social-button" data-social-provider="fe" title="Sign in with Security Key">
            <span class="account-social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </span>
          </button>
        </div>
        
        <div class="account-divider" aria-hidden="true"><span>or</span></div>

        <form class="account-form" id="accountForm">
          <div class="input-group" id="accountNameGroup" hidden>
            <label for="accountName">Name</label>
            <input id="accountName" type="text" maxlength="80" autocomplete="name">
          </div>
          <div class="input-group">
            <label for="accountEmail">Email</label>
            <input id="accountEmail" type="email" required autocomplete="email">
          </div>
          <div class="input-group">
            <label for="accountPassword">Password</label>
            <input id="accountPassword" type="password" required minlength="6" autocomplete="current-password">
            <button type="button" class="password-toggle" id="togglePasswordBtn" aria-label="Show password" aria-pressed="false">Show</button>
          </div>
          <button class="account-submit" type="submit" id="accountSubmit">Sign In</button>
          <p class="account-status" id="accountStatus" role="status"></p>
        </form>
      </section>
    </div>
  `);

  const modal = document.getElementById('accountModal');
  const form = document.getElementById('accountForm');
  const passwordInput = document.getElementById('accountPassword');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const status = document.getElementById('accountStatus');
  const dropUserName = document.getElementById('dropUserName');
  const dropUserEmail = document.getElementById('dropUserEmail');
  const logoutBtn = document.getElementById('logoutBtn');
  const switchAccountBtn = document.getElementById('switchAccountBtn');
  const nameGroup = document.getElementById('accountNameGroup');
  const nameInput = document.getElementById('accountName');
  const title = document.getElementById('accountDialogTitle');
  const subtitle = document.getElementById('accountDialogSub');
  const switchContainer = document.getElementById('accountSwitchContainer');
  const submitButton = document.getElementById('accountSubmit');
  let authMode = 'signin';

  const setAuthMode = (mode) => {
    authMode = mode;
    const signingUp = mode === 'signup';
    title.textContent = signingUp ? 'Create account' : 'Sign in';
    subtitle.textContent = signingUp ? 'Create an account to send feedback' : 'Get access to more learning features';
    nameGroup.hidden = !signingUp;
    nameInput.required = signingUp;
    passwordInput.autocomplete = signingUp ? 'new-password' : 'current-password';
    submitButton.textContent = signingUp ? 'Create Account' : 'Sign In';
    switchContainer.innerHTML = signingUp
      ? 'Already have an account? <a href="#" class="account-switch-link" data-account-mode="signin">Sign in</a>'
      : 'Don\'t have an account? <a href="#" class="account-switch-link" data-account-mode="signup">Register</a>';
    status.textContent = '';
  };

  const checkServerSession = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        renderUserProfile({
          email: user.email,
          name: user.user_metadata?.display_name || user.email?.split('@')[0]
        });
      } else {
        renderGuestState();
      }
    } catch (err) {
      renderGuestState();
    }
  };

  const renderUserProfile = (user) => {
    button.className = 'account-profile-btn';
    if (user.avatarUrl) {
      button.innerHTML = `
        <img class="account-avatar-img" src="${user.avatarUrl}" alt="Avatar">
      `;
    } else {
      const firstLetter = (user.email || 'U').charAt(0).toUpperCase();
      button.innerHTML = `
        <div class="account-avatar-fallback">${firstLetter}</div>
      `;
    }
    dropUserName.textContent = user.name || 'Account';
    dropUserEmail.textContent = user.email;
    button.title = "Account Menu";
  };

  const renderGuestState = () => {
    button.className = 'account-button';
    button.innerHTML = `Sign in`;
    button.title = "Sign in";
    dropdownMenu.classList.remove('is-open');
  };

  const handleServerLogin = async (credentials) => {
    try {
      status.textContent = "Authenticating...";
      const client = getSupabaseClient();
      const { data, error } = await client.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });
      if (error) throw error;
      renderUserProfile({
        email: data.user.email,
        name: data.user.user_metadata?.display_name || data.user.email.split('@')[0]
      });
      modal.classList.remove('is-open');
      document.body.classList.remove('account-modal-open');
      status.textContent = "";
      window.dispatchEvent(new CustomEvent('unifindex:authchange'));
    } catch (err) {
      status.textContent = err.message === 'Supabase is not configured yet.'
        ? 'Supabase setup မပြီးသေးပါ။'
        : 'Email သို့မဟုတ် password မမှန်ပါ။';
    }
  };

  const handleServerSignup = async (credentials) => {
    try {
      status.textContent = 'Creating your account...';
      const client = getSupabaseClient();
      const { data, error } = await client.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: { data: { display_name: credentials.name } }
      });
      if (error) throw error;
      if (!data.session) {
        status.textContent = 'အတည်ပြုရန် email ပို့ပြီးပါပြီ။ Email ထဲမှ link ကိုနှိပ်ပြီးမှ sign in ဝင်ပါ။';
        return;
      }
      renderUserProfile({ email: data.user.email, name: credentials.name });
      modal.classList.remove('is-open');
      document.body.classList.remove('account-modal-open');
      window.dispatchEvent(new CustomEvent('unifindex:authchange'));
    } catch (err) {
      status.textContent = err.message === 'Supabase is not configured yet.'
        ? 'Supabase setup မပြီးသေးပါ။'
        : err.message;
    }
  };

  const handleServerLogout = async () => {
    try {
      await getSupabaseClient().auth.signOut();
      renderGuestState();
      dropdownMenu.classList.remove('is-open');
      window.dispatchEvent(new CustomEvent('unifindex:authchange'));
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  button.addEventListener('click', (e) => {
    e.stopPropagation();
    getCurrentUser().then(user => {
      if (user) {
        dropdownMenu.classList.toggle('is-open');
      } else {
        setAuthMode('signin');
        modal.classList.add('is-open');
        document.body.classList.add('account-modal-open');
      }
    });
  });

  switchAccountBtn.addEventListener('click', () => {
    dropdownMenu.classList.remove('is-open');
    handleServerLogout();
    setAuthMode('signin');
    modal.classList.add('is-open');
    document.body.classList.add('account-modal-open');
  });

  logoutBtn.addEventListener('click', () => {
    handleServerLogout();
  });

  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) {
      dropdownMenu.classList.remove('is-open');
    }
  });

  modal.querySelectorAll('[data-close-account]').forEach(el => {
    el.addEventListener('click', () => {
      modal.classList.remove('is-open');
      document.body.classList.remove('account-modal-open');
    });
  });

  switchContainer.addEventListener('click', (event) => {
    const modeLink = event.target.closest('[data-account-mode]');
    if (!modeLink) return;
    event.preventDefault();
    setAuthMode(modeLink.dataset.accountMode);
  });

  togglePasswordBtn.addEventListener('click', () => {
    const showPassword = passwordInput.type === 'password';
    passwordInput.type = showPassword ? 'text' : 'password';
    togglePasswordBtn.textContent = showPassword ? 'Hide' : 'Show';
    togglePasswordBtn.setAttribute('aria-label', showPassword ? 'Hide password' : 'Show password');
    togglePasswordBtn.setAttribute('aria-pressed', String(showPassword));
  });

  modal.querySelectorAll('[data-social-provider]').forEach(btn => {
    btn.addEventListener('click', () => {
      const provider = btn.dataset.socialProvider;
      const providerNames = {
        google: 'Google',
        facebook: 'Facebook',
        github: 'GitHub',
        fe: 'Security Key'
      };
      const providerName = providerNames[provider] || 'ဤနည်းလမ်း';
      alert(`${providerName} ဖြင့် ဝင်ရောက်ခြင်းကို လောလောဆယ် မရရှိသေးပါ။ Email နှင့် password ကို အသုံးပြု၍ ဝင်ရောက်ပါ။`);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('accountEmail').value;
    const password = passwordInput.value;
    if (authMode === 'signup') {
      handleServerSignup({ email, password, name: nameInput.value.trim() });
    } else {
      handleServerLogin({ email, password });
    }
  });

  checkServerSession();
})();
