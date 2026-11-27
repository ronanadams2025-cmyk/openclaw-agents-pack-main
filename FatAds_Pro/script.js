const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const header = $('#header');
const nav = $('#nav');
const burger = $('#burger');
const backTop = $('#backTop');

function updateScrollUI() {
  header.classList.toggle('scrolled', window.scrollY > 25);
  backTop.classList.toggle('visible', window.scrollY > 450);
}
window.addEventListener('scroll', updateScrollUI, { passive: true });
updateScrollUI();

burger.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(isOpen));
  burger.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
});
$$('#nav a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
}));
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Popup: open, close, Escape and body scroll lock.
const popup = $('#statsPopup');
let lastFocusedElement = null;
function openPopup() {
  lastFocusedElement = document.activeElement;
  popup.classList.add('open');
  popup.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  $('.popup-close', popup).focus();
}
function closePopup() {
  popup.classList.remove('open');
  popup.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
  if (lastFocusedElement) lastFocusedElement.focus();
}
$$('[data-open-popup]').forEach(button => button.addEventListener('click', openPopup));
$$('[data-close-popup]').forEach(button => button.addEventListener('click', closePopup));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && popup.classList.contains('open')) closePopup();
});

// Lead form demo. Connect this handler to a backend/API to really store leads.
const leadForm = $('#leadForm');
leadForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!leadForm.reportValidity()) return;
  const data = Object.fromEntries(new FormData(leadForm).entries());
  const message = $('#formMessage');
  message.textContent = `Спасибо, ${data.name}! Заявка подготовлена. Для реальной отправки подключите серверную обработку.`;
  leadForm.reset();
});

// Chat widget demo: messages are local and are not sent to a real support team.
const chatBox = $('#chatBox');
const chatBody = $('#chatBody');
const chatInput = $('#chatText');
function toggleChat(force) {
  const open = typeof force === 'boolean' ? force : !chatBox.classList.contains('open');
  chatBox.classList.toggle('open', open);
  if (open) $('#openChat').querySelector('.chat-unread').style.display = 'none';
}
$('#openChat').addEventListener('click', () => toggleChat());
$('#closeChat').addEventListener('click', () => toggleChat(false));

function addChatMessage(text, type = 'bot') {
  const message = document.createElement('div');
  message.className = `chat-message ${type === 'user' ? 'user' : ''}`;
  message.textContent = text;
  chatBody.append(message);
  chatBody.scrollTop = chatBody.scrollHeight;
}
function answerFor(text) {
  const lower = text.toLowerCase();
  if (lower.includes('формат')) return 'Доступны Push, In-Page Push, Popunder и Native Ads. Оставьте заявку — поможем подобрать формат под вашу задачу.';
  if (lower.includes('бюджет') || lower.includes('депозит')) return 'Условия и минимальный бюджет зависят от формата и ГЕО. Напишите нам через форму заявки, чтобы уточнить актуальные условия.';
  if (lower.includes('начать') || lower.includes('запуск')) return 'Чтобы начать, заполните форму на сайте. Команда свяжется с вами и поможет с настройкой первой кампании.';
  return 'Спасибо за сообщение! Это демонстрационный чат. Для связи с реальной поддержкой используйте форму заявки или email hello@fatads.example.';
}
function sendChat(text) {
  const clean = text.trim();
  if (!clean) return;
  addChatMessage(clean, 'user');
  window.setTimeout(() => addChatMessage(answerFor(clean)), 450);
}
$('#chatForm').addEventListener('submit', event => {
  event.preventDefault();
  sendChat(chatInput.value);
  chatInput.value = '';
});
$$('[data-reply]').forEach(button => button.addEventListener('click', () => sendChat(button.dataset.reply)));

// Cookie preference is stored locally in this browser.
const cookieBanner = $('#cookieBanner');
try {
  if (localStorage.getItem('fatads-cookie-accepted') === 'yes') cookieBanner.classList.add('hidden');
} catch (_) {}
$('#acceptCookie').addEventListener('click', () => {
  cookieBanner.classList.add('hidden');
  try { localStorage.setItem('fatads-cookie-accepted', 'yes'); } catch (_) {}
});