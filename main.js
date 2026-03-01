// Execution Engine — waitlist form handler
// Loaded via <script defer> after Supabase CDN script

const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function handleWaitlistSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const emailInput = form.querySelector('input[type="email"]');
  const email = emailInput.value.trim();

  // Prevent double-submit
  if (btn.disabled) return;
  btn.disabled = true;
  btn.textContent = 'Joining...';

  try {
    const { error } = await supabaseClient
      .from('execution_engine_waitlist')
      .insert({ email });

    if (error) {
      // Handle UNIQUE constraint violation (duplicate email)
      if (error.code === '23505') {
        form.innerHTML = '<p class="form-success">You\'re already on the list. Watch your inbox.</p>';
        return;
      }
      throw error;
    }

    // Success: replace form with inline confirmation — no redirect, no page reload
    form.innerHTML = '<p class="form-success">You\'re on the list. Watch your inbox.</p>';

  } catch (err) {
    console.error('Waitlist error:', err);
    btn.disabled = false;
    btn.textContent = 'Join Waitlist';

    let errEl = form.querySelector('.form-error');
    if (!errEl) {
      errEl = document.createElement('p');
      errEl.className = 'form-error';
      form.appendChild(errEl);
    }
    errEl.textContent = 'Something went wrong. Please try again.';
  }
}

// Attach handler to ALL waitlist forms (hero + bottom CTA)
document.querySelectorAll('.waitlist-form').forEach(form => {
  form.addEventListener('submit', handleWaitlistSubmit);
});
