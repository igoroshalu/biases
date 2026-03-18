const EXAMPLE_TICKETS = [
  {
    id: 1,
    title: 'Основные термины и определения',
    theme: 'Теория',
    summary: 'Базовые понятия, которые важно уверенно воспроизводить на экзамене.',
    question: 'Дай определение ключевому понятию темы и назови его основные признаки.',
    answer: 'Сформулируй определение своими словами, затем перечисли 3–4 главных признака и коротко поясни каждый.'
  },
  {
    id: 2,
    title: 'Классификация и структура',
    theme: 'Теория',
    summary: 'Удобный билет для повторения списков, классификаций и иерархии понятий.',
    question: 'Какие основные элементы входят в классификацию по этой теме?',
    answer: 'Ответ лучше строить по пунктам: назвать каждый элемент, дать короткое описание и указать отличие от остальных.'
  },
  {
    id: 3,
    title: 'Алгоритм решения задачи',
    theme: 'Практика',
    summary: 'Повторение последовательности действий и типичных ошибок.',
    question: 'Опиши пошаговый алгоритм выполнения задания по теме.',
    answer: 'Начни с подготовки данных, затем перечисли шаги выполнения, контроль результата и типичные ошибки, которых нужно избегать.'
  },
  {
    id: 4,
    title: 'Сравнение подходов',
    theme: 'Анализ',
    summary: 'Билет на понимание различий между похожими методами или терминами.',
    question: 'В чём различие между двумя близкими подходами и когда используется каждый из них?',
    answer: 'Сначала назови общее, затем выдели 2–3 ключевых различия, после чего приведи пример ситуации для каждого подхода.'
  },
  {
    id: 5,
    title: 'Типовые ошибки и профилактика',
    theme: 'Практика',
    summary: 'Полезен для подготовки к устному ответу с примерами.',
    question: 'Какие типичные ошибки допускают по этой теме и как их предотвратить?',
    answer: 'Перечисли основные ошибки, объясни их причину и добавь по одной профилактической рекомендации для каждой.'
  }
];

const tickets = Array.from({ length: 50 }, (_, index) => {
  const preset = EXAMPLE_TICKETS[index];
  if (preset) {
    return preset;
  }

  const ticketNumber = index + 1;
  return {
    id: ticketNumber,
    title: `Билет ${ticketNumber}`,
    theme: ticketNumber % 2 === 0 ? 'Теория' : 'Практика',
    summary: 'Здесь можно подставить реальное название билета и короткую подсказку по содержанию.',
    question: `Вставь сюда формулировку вопроса для билета №${ticketNumber}.`,
    answer: 'Вставь сюда полный ответ, который хочешь повторять перед экзаменом.'
  };
});

const state = {
  viewedTicketIds: new Set(),
  randomPulls: 0,
  lastOpenedTicketId: null,
  currentRandomTicketId: null
};

const elements = {
  totalTicketsCount: document.getElementById('totalTicketsCount'),
  viewedTicketsCount: document.getElementById('viewedTicketsCount'),
  randomModeCount: document.getElementById('randomModeCount'),
  openPickerButton: document.getElementById('openPickerButton'),
  randomTicketButton: document.getElementById('randomTicketButton'),
  repeatLastTicketButton: document.getElementById('repeatLastTicketButton'),
  emptyState: document.getElementById('emptyState'),
  ticketViewer: document.getElementById('ticketViewer'),
  viewerTicketNumber: document.getElementById('viewerTicketNumber'),
  viewerTicketTheme: document.getElementById('viewerTicketTheme'),
  viewerTicketTitle: document.getElementById('viewerTicketTitle'),
  viewerTicketSummary: document.getElementById('viewerTicketSummary'),
  viewerTicketQuestion: document.getElementById('viewerTicketQuestion'),
  viewerTicketAnswer: document.getElementById('viewerTicketAnswer'),
  toggleViewerAnswerButton: document.getElementById('toggleViewerAnswerButton'),
  viewerProgressText: document.getElementById('viewerProgressText'),
  closeViewerButton: document.getElementById('closeViewerButton'),
  randomTicketNumber: document.getElementById('randomTicketNumber'),
  randomTicketTitle: document.getElementById('randomTicketTitle'),
  randomTicketSummary: document.getElementById('randomTicketSummary'),
  randomTicketQuestion: document.getElementById('randomTicketQuestion'),
  randomTicketAnswer: document.getElementById('randomTicketAnswer'),
  showRandomAnswerButton: document.getElementById('showRandomAnswerButton'),
  nextRandomTicketButton: document.getElementById('nextRandomTicketButton'),
  ticketPickerModal: document.getElementById('ticketPickerModal'),
  closePickerButton: document.getElementById('closePickerButton'),
  ticketSearchInput: document.getElementById('ticketSearchInput'),
  ticketList: document.getElementById('ticketList')
};

function updateStats() {
  elements.totalTicketsCount.textContent = String(tickets.length);
  elements.viewedTicketsCount.textContent = String(state.viewedTicketIds.size);
  elements.randomModeCount.textContent = String(state.randomPulls);
  elements.repeatLastTicketButton.disabled = state.lastOpenedTicketId === null;
}

function markTicketViewed(ticketId) {
  state.viewedTicketIds.add(ticketId);
  state.lastOpenedTicketId = ticketId;
  updateStats();
}

function getTicketById(ticketId) {
  return tickets.find(ticket => ticket.id === ticketId);
}

function openTicket(ticketId) {
  const ticket = getTicketById(ticketId);
  if (!ticket) {
    return;
  }

  markTicketViewed(ticket.id);
  elements.emptyState.classList.add('hidden');
  elements.ticketViewer.classList.remove('hidden');
  elements.viewerTicketNumber.textContent = `Билет №${ticket.id}`;
  elements.viewerTicketTheme.textContent = ticket.theme;
  elements.viewerTicketTitle.textContent = ticket.title;
  elements.viewerTicketSummary.textContent = ticket.summary;
  elements.viewerTicketQuestion.textContent = ticket.question;
  elements.viewerTicketAnswer.textContent = ticket.answer;
  elements.viewerTicketAnswer.classList.add('hidden-answer');
  elements.toggleViewerAnswerButton.textContent = 'Показать ответ';
  elements.viewerProgressText.textContent = `Открыт билет ${ticket.id} из ${tickets.length}`;
}

function closeTicketViewer() {
  elements.ticketViewer.classList.add('hidden');
  elements.emptyState.classList.remove('hidden');
}

function toggleViewerAnswer() {
  const isHidden = elements.viewerTicketAnswer.classList.contains('hidden-answer');
  elements.viewerTicketAnswer.classList.toggle('hidden-answer', !isHidden);
  elements.toggleViewerAnswerButton.textContent = isHidden ? 'Скрыть ответ' : 'Показать ответ';
}

function renderTicketList(filter = '') {
  const normalizedFilter = filter.trim().toLowerCase();
  const filteredTickets = tickets.filter(ticket => {
    const searchableText = `${ticket.id} ${ticket.title} ${ticket.summary} ${ticket.theme}`.toLowerCase();
    return searchableText.includes(normalizedFilter);
  });

  if (!filteredTickets.length) {
    elements.ticketList.innerHTML = '<div class="no-results">Ничего не найдено. Попробуй другой запрос.</div>';
    return;
  }

  elements.ticketList.innerHTML = filteredTickets.map(ticket => `
    <button class="ticket-item" type="button" data-ticket-id="${ticket.id}">
      <span class="ticket-badge">Билет №${ticket.id}</span>
      <div class="ticket-item-title">${ticket.title}</div>
      <p class="ticket-item-summary">${ticket.summary}</p>
    </button>
  `).join('');
}

function openPicker() {
  elements.ticketPickerModal.classList.remove('hidden');
  elements.ticketPickerModal.setAttribute('aria-hidden', 'false');
  renderTicketList(elements.ticketSearchInput.value);
  elements.ticketSearchInput.focus();
}

function closePicker() {
  elements.ticketPickerModal.classList.add('hidden');
  elements.ticketPickerModal.setAttribute('aria-hidden', 'true');
}

function getRandomTicket() {
  if (tickets.length === 0) {
    return null;
  }

  const availableTickets = tickets.filter(ticket => ticket.id !== state.currentRandomTicketId);
  const pool = availableTickets.length ? availableTickets : tickets;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

function showRandomTicket() {
  const ticket = getRandomTicket();
  if (!ticket) {
    return;
  }

  state.currentRandomTicketId = ticket.id;
  state.randomPulls += 1;
  markTicketViewed(ticket.id);

  elements.randomTicketNumber.textContent = `Билет №${ticket.id}`;
  elements.randomTicketTitle.textContent = ticket.title;
  elements.randomTicketSummary.textContent = ticket.summary;
  elements.randomTicketQuestion.textContent = ticket.question;
  elements.randomTicketAnswer.textContent = ticket.answer;
  elements.randomTicketAnswer.classList.add('hidden-answer');
  elements.showRandomAnswerButton.disabled = false;
  elements.showRandomAnswerButton.textContent = 'Смотреть ответ';
  elements.nextRandomTicketButton.disabled = true;
  updateStats();
}

function revealRandomAnswer() {
  elements.randomTicketAnswer.classList.remove('hidden-answer');
  elements.showRandomAnswerButton.textContent = 'Ответ открыт';
  elements.showRandomAnswerButton.disabled = true;
  elements.nextRandomTicketButton.disabled = false;
}

function repeatLastTicket() {
  if (state.lastOpenedTicketId !== null) {
    openTicket(state.lastOpenedTicketId);
  }
}

function bindEvents() {
  elements.openPickerButton.addEventListener('click', openPicker);
  elements.closePickerButton.addEventListener('click', closePicker);
  elements.randomTicketButton.addEventListener('click', showRandomTicket);
  elements.showRandomAnswerButton.addEventListener('click', revealRandomAnswer);
  elements.nextRandomTicketButton.addEventListener('click', showRandomTicket);
  elements.toggleViewerAnswerButton.addEventListener('click', toggleViewerAnswer);
  elements.closeViewerButton.addEventListener('click', closeTicketViewer);
  elements.repeatLastTicketButton.addEventListener('click', repeatLastTicket);

  elements.ticketSearchInput.addEventListener('input', event => {
    renderTicketList(event.target.value);
  });

  elements.ticketList.addEventListener('click', event => {
    const ticketButton = event.target.closest('[data-ticket-id]');
    if (!ticketButton) {
      return;
    }

    openTicket(Number(ticketButton.dataset.ticketId));
    closePicker();
  });

  elements.ticketPickerModal.addEventListener('click', event => {
    if (event.target === elements.ticketPickerModal) {
      closePicker();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !elements.ticketPickerModal.classList.contains('hidden')) {
      closePicker();
    }
  });
}

function init() {
  updateStats();
  renderTicketList();
  bindEvents();
}

init();
