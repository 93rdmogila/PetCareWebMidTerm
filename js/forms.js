const rule = {
  required: message => value => {
    const filled = typeof value === 'boolean' ? value : String(value).trim() !== '';
    return filled ? '' : message;
  },
  minLength: (length, message) => value => String(value).trim().length >= length ? '' : message,
  maxLength: (length, message) => value => String(value).trim().length <= length ? '' : message,
  email: message => value => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value).trim()) ? '' : message,
  phone: message => value => {
    const text = String(value).trim();
    const digits = text.replace(/\D/g, '');
    return /^\+?[\d\s\-()]+$/.test(text) && digits.length >= 7 && digits.length <= 15 ? '' : message;
  },
  numberRange: (min, max, message) => value => {
    const number = Number(value);
    return String(value).trim() !== '' && Number.isFinite(number) && number >= min && number <= max ? '' : message;
  }
};

function getFeedbackNode(input) {
  const holder = input.closest('.form-check') || input.parentElement;
  let node = holder.querySelector(`.invalid-feedback[data-for="${input.id}"]`);
  if (!node) {
    node = el('div', 'invalid-feedback');
    node.dataset.for = input.id;
    if (input.closest('.form-check')) holder.appendChild(node);
    else input.after(node);
  }
  return node;
}

function showFieldError(input, message) {
  getFeedbackNode(input).textContent = message;
  input.classList.toggle('is-invalid', Boolean(message));
  input.classList.toggle('is-valid', !message && input.type !== 'checkbox' && input.value.trim() !== '');
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
}

function validateField(input, rules) {
  const value = input.type === 'checkbox' ? input.checked : input.value;
  for (const check of rules) {
    const message = check(value);
    if (message) {
      showFieldError(input, message);
      return false;
    }
  }
  showFieldError(input, '');
  return true;
}

function validateForm(form, ruleMap) {
  let firstInvalid = null;
  Object.entries(ruleMap).forEach(([id, rules]) => {
    const input = form.querySelector('#' + id);
    if (!input || input.closest('[hidden]')) return;
    if (!validateField(input, rules) && !firstInvalid) firstInvalid = input;
  });
  if (firstInvalid) firstInvalid.focus();
  return !firstInvalid;
}

function attachLiveValidation(form, ruleMap) {
  Object.entries(ruleMap).forEach(([id, rules]) => {
    const input = form.querySelector('#' + id);
    if (!input) return;
    const eventName = input.tagName === 'SELECT' || input.type === 'checkbox' ? 'change' : 'input';
    input.addEventListener(eventName, () => validateField(input, rules));
    input.addEventListener('blur', () => validateField(input, rules));
  });
}

function showFormMessage(form, text, type = 'success') {
  let box = form.querySelector('.form-message');
  if (!box) {
    box = el('div');
    box.setAttribute('role', 'status');
    form.appendChild(box);
  }
  box.className = `form-message alert alert-${type} mt-3 mb-0`;
  box.textContent = text;
}

function resetFormState(form) {
  form.querySelectorAll('.is-invalid, .is-valid').forEach(input => input.classList.remove('is-invalid', 'is-valid'));
  form.querySelectorAll('.invalid-feedback').forEach(node => { node.textContent = ''; });
  const box = form.querySelector('.form-message');
  if (box) box.remove();
}