App.views.events = {
  currentTab: 'pending',

  init() {
    this.currentTab = 'pending';
    this.render();
  },

  render() {
    const container = document.getElementById('view-events');
    if (!container) return;

    container.innerHTML = `
      <div class="events-toolbar">
        <div class="tabs-inline">
          <button class="tab-btn ${this.currentTab === 'pending' ? 'active' : ''}" data-tab="pending">待办</button>
          <button class="tab-btn ${this.currentTab === 'completed' ? 'active' : ''}" data-tab="completed">已完成</button>
        </div>
        <button class="btn btn-primary" id="add-event">＋ 新增</button>
      </div>
      <div id="events-list"></div>
    `;

    this.renderEventsList();
    this.bindEvents();
  },

  renderEventsList() {
    const list = document.getElementById('events-list');
    if (!list) return;

    const events = App.store.loadEvents();
    const today = App.calendar.today();

    let filtered = this.currentTab === 'pending'
      ? events.filter(e => !e.done)
      : events.filter(e => e.done);

    filtered.sort((a, b) => a.date.localeCompare(b.date));

    if (filtered.length === 0) {
      list.innerHTML = `<div class="empty-state">暂无${this.currentTab === 'pending' ? '待办' : '已完成'}日程</div>`;
      return;
    }

    let html = '';
    filtered.forEach(event => {
      const isOverdue = !event.done && event.date < today;
      const weekday = App.calendar.weekday(event.date);
      const timeStr = event.startTime + (event.endTime ? `–${event.endTime}` : '');

      html += `
        <div class="event-card ${isOverdue ? 'overdue' : ''} ${event.done ? 'done' : ''}">
          <div class="event-color" style="background: ${this.getEventColor(event.color)}"></div>
          <div class="event-content">
            <div class="event-header">
              <label class="checkbox-label">
                <input type="checkbox" ${event.done ? 'checked' : ''} data-id="${event.id}" class="event-checkbox">
                <span class="event-title">${event.title}</span>
              </label>
              <div class="event-actions">
                <button class="btn-icon edit-btn" data-id="${event.id}">✎</button>
                <button class="btn-icon delete-btn" data-id="${event.id}"></button>
              </div>
            </div>
            <div class="event-meta">
              <span>${event.date} ${weekday}</span>
              <span>${timeStr}</span>
              ${event.location ? `<span>📍 ${event.location}</span>` : ''}
              ${isOverdue ? '<span class="overdue-tag">逾期</span>' : ''}
            </div>
            ${event.notes ? `<div class="event-notes">${event.notes}</div>` : ''}
          </div>
        </div>
      `;
    });

    list.innerHTML = html;
    this.bindEventInteractions();
  },

  getEventColor(colorIndex) {
    const colors = ['#fbbf24', '#34d399', '#60a5fa', '#f87171', '#a78bfa', '#fb923c'];
    return colors[(colorIndex - 1) % colors.length] || colors[0];
  },

  bindEvents() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentTab = btn.dataset.tab;
        this.render();
      });
    });

    document.getElementById('add-event')?.addEventListener('click', () => {
      this.openEventModal();
    });
  },

  bindEventInteractions() {
    document.querySelectorAll('.event-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const id = e.target.dataset.id;
        App.store.toggleDone(id);
        this.render();
      });
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const event = App.store.loadEvents().find(e => e.id === id);
        if (event) this.openEventModal(event);
      });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const event = App.store.loadEvents().find(e => e.id === id);
        if (event) this.confirmDelete(id, event.title);
      });
    });
  },

  openEventModal(event = null) {
    const isEdit = !!event;
    const content = `
      <h3>${isEdit ? '编辑日程' : '新建日程'}</h3>
      <form id="event-form">
        <div class="form-group">
          <label>标题 *</label>
          <input type="text" name="title" value="${event?.title || ''}" required>
        </div>
        <div class="form-group">
          <label>日期 *</label>
          <input type="date" name="date" value="${event?.date || App.calendar.today()}" required>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>开始时间</label>
            <input type="time" name="startTime" value="${event?.startTime || ''}">
          </div>
          <div class="form-group">
            <label>结束时间</label>
            <input type="time" name="endTime" value="${event?.endTime || ''}">
          </div>
        </div>
        <div class="form-group">
          <label>地点</label>
          <input type="text" name="location" value="${event?.location || ''}">
        </div>
        <div class="form-group">
          <label>备注</label>
          <textarea name="notes" rows="3">${event?.notes || ''}</textarea>
        </div>
        <div class="form-group">
          <label>颜色</label>
          <div class="color-picker">
            ${[1,2,3,4,5,6].map(i => `
              <label class="color-option">
                <input type="radio" name="color" value="${i}" ${(!event && i === 1) || event?.color === i ? 'checked' : ''}>
                <span class="color-swatch" style="background: ${this.getEventColor(i)}"></span>
              </label>
            `).join('')}
          </div>
        </div>
        <div class="form-actions">
          <button type="button" class="btn" onclick="App.modal.close()">取消</button>
          <button type="submit" class="btn btn-primary">${isEdit ? '保存' : '创建'}</button>
        </div>
      </form>
    `;

    App.modal.open(content, {
      onOpen: (modalEl) => {
        const form = modalEl.querySelector('#event-form');
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const formData = new FormData(form);
          const data = {
            title: formData.get('title').trim(),
            date: formData.get('date'),
            startTime: formData.get('startTime'),
            endTime: formData.get('endTime'),
            location: formData.get('location').trim(),
            notes: formData.get('notes').trim(),
            color: parseInt(formData.get('color')) || 1
          };

          if (!data.title || !data.date) {
            alert('标题和日期为必填项');
            return;
          }

          if (data.endTime && data.startTime && data.endTime <= data.startTime) {
            alert('结束时间必须晚于开始时间');
            return;
          }

          if (isEdit) {
            App.store.updateEvent(event.id, data);
          } else {
            App.store.addEvent(data);
          }

          App.modal.close();
          this.render();
        });
      }
    });
  },

  confirmDelete(id, title) {
    const content = `
      <h3>确认删除</h3>
      <p>确定要删除「${title}」吗？此操作不可撤销。</p>
      <div class="form-actions" style="margin-top: 24px;">
        <button class="btn" onclick="App.modal.close()">取消</button>
        <button class="btn btn-primary" id="confirm-delete">删除</button>
      </div>
    `;

    App.modal.open(content, {
      onOpen: (modalEl) => {
        modalEl.querySelector('#confirm-delete').addEventListener('click', () => {
          App.store.deleteEvent(id);
          App.modal.close();
          this.render();
        });
      }
    });
  }
};
