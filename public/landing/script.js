/* 
   All In One (AIN) — Landing Page Script
 */

/* ── Smooth Scroll ── */
function scrollToId(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Auth Modal ── */
function openAuth(tab) {
  window.location.href = tab === 'login' ? '/login' : '/workspace';
  return;
  document.getElementById('authOverlay').classList.add('on');
  switchTab(tab);
}

function closeAuth() {
  document.getElementById('authOverlay').classList.remove('on');
}

function switchTab(tab) {
  document.getElementById('tabSignup').classList.toggle('on', tab === 'signup');
  document.getElementById('tabLogin').classList.toggle('on', tab === 'login');
  document.getElementById('signupTab').style.display = tab === 'signup' ? 'block' : 'none';
  document.getElementById('loginTab').style.display = tab === 'login' ? 'block' : 'none';
}

/*  Pricing Toggle */
document.addEventListener('DOMContentLoaded', function () {
  const ptBtns = document.querySelectorAll('.pt-btn');
  const prices = {
    monthly: {
      Starter: ['500', 'جنيه / شهر'],
      Growth: ['1,200', 'جنيه / شهر'],
      Pro: ['2,500', 'جنيه / شهر']
    },
    yearly: {
      Starter: ['4,800', 'جنيه / سنة'],
      Growth: ['11,520', 'جنيه / سنة'],
      Pro: ['24,000', 'جنيه / سنة']
    }
  };

  function updatePricing(period) {
    document.querySelectorAll('.price-card').forEach(function (card) {
      const plan = card.querySelector('.price-name');
      const amount = card.querySelector('.price-amt');
      const per = card.querySelector('.price-per');
      if (!plan || !amount || !per || !prices[period][plan.textContent.trim()]) return;
      amount.textContent = prices[period][plan.textContent.trim()][0];
      per.textContent = prices[period][plan.textContent.trim()][1];
    });
  }

  ptBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      ptBtns.forEach(function (b) { b.classList.remove('on'); });
      btn.classList.add('on');
      updatePricing(btn.textContent.indexOf('سنوي') !== -1 ? 'yearly' : 'monthly');
    });
  });
});

/*  Onboarding Flow  */
function startOnboarding() {
  window.location.href = '/workspace';
  return;
  closeAuth();
  document.getElementById('marketing-page').style.display = 'none';
  document.getElementById('onboardFlow').classList.add('on');
  window.scrollTo(0, 0);
  updatePreview();
}

function closeOnboarding() {
  document.getElementById('onboardFlow').classList.remove('on');
  document.getElementById('marketing-page').style.display = 'block';
}

function goToDashboard() {
  window.location.href = '/workspace';
}

/*  Color Picker  */
let currentColor = '#4F46E5';

function selectColor(el, color) {
  document.querySelectorAll('.color-dot').forEach(function (d) { d.classList.remove('on'); });
  el.classList.add('on');
  currentColor = color;
  updatePreview();
}

/*  Logo Upload Preview  */
function previewLogo(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (ev) {
    document.getElementById('logoUploadPrompt').style.display = 'none';
    document.getElementById('logoPreviewWrap').style.display = 'block';
    const img = document.createElement('img');
    img.src = ev.target.result;
    img.style.cssText = 'width:88px;height:88px;border-radius:18px;object-fit:cover;margin:0 auto 14px;display:block;box-shadow:var(--sh)';
    const wrap = document.getElementById('logoPreviewWrap');
    wrap.innerHTML = '';
    wrap.appendChild(img);
    document.getElementById('prevLogo').innerHTML =
      '<img src="' + ev.target.result + '" style="width:100%;height:100%;object-fit:cover;border-radius:11px">';
  };
  reader.readAsDataURL(file);
}

/*  Live Preview (Step 1)  */
function updatePreview() {
  const name = document.getElementById('ob-company-name').value || 'اسم الشركة';
  const bio  = document.getElementById('ob-bio').value || 'بدون نبذة بعد...';
  document.getElementById('prevName').textContent = name;
  document.getElementById('prevBio').textContent  = bio;
  document.getElementById('prevLogo').style.background = currentColor;
  const initials = name.split(' ').slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase();
  const prevLogo = document.getElementById('prevLogo');
  if (!prevLogo.querySelector('img')) {
    prevLogo.textContent = initials || 'TE';
  }
}

function updateBioCounter() {
  const len = document.getElementById('ob-bio').value.length;
  document.getElementById('bioCounter').textContent = len + '/180';
  updatePreview();
}

/*  Plan Selection (Step 3)  */
function selectPlan(el) {
  document.querySelectorAll('.plan-opt').forEach(function (p) { p.classList.remove('on'); });
  el.classList.add('on');
  const price = el.querySelector('.plan-opt-price').textContent;
  document.getElementById('planPriceLabel').textContent = price;
}

/*  Step Navigation  */
function goStep(n) {
  document.querySelectorAll('.flow-step-page').forEach(function (p) { p.style.display = 'none'; });
  document.getElementById('ob-step-' + n).style.display = 'block';
  for (let i = 1; i <= 4; i++) {
    document.getElementById('fs' + i).classList.toggle('done', i <= n);
  }
  if (n === 4) {
    document.getElementById('prevLogo2').style.background = currentColor;
    document.getElementById('prevLogo2').innerHTML = document.getElementById('prevLogo').innerHTML;
    document.getElementById('prevName2').textContent =
      document.getElementById('ob-company-name').value || 'اسم الشركة';
  }
  window.scrollTo(0, 0);
}

/*  Init  */
document.addEventListener('DOMContentLoaded', function () {
  updateBioCounter();
});
