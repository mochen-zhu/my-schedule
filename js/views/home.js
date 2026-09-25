App.views.home = {
  refreshTimer: null,

  init() {
    this.render();
    this.startAutoRefresh();
  },

  destroy() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  },

  render() {
    const container = document.getElementById('view-home');
    if (!container) return;

    const today = App.calendar.today();
    const weekNum = App.calendar.getWeekNumber(today);
    const weekday = App.calendar.weekday(today);
    const isHoliday = App.calendar.isHoliday(today);
    const holidayName = App.calendar.getHolidayName(today);

    const todayCourses = this.getTodayCourses();
    const todayEvents = App.store.eventsOnDate(today);

    container.innerHTML = `
      <div class="home-date-bar">
        <div class="date-main">${today} ${weekday}</div>
        <div class="date-meta">
          ${weekNum ? `秋季第 ${weekNum} 周` : '假期'}
          ${isHoliday ? `<span class="holiday-tag">${holidayName}（休）</span>` : ''}
        </div>
      </div>

      <div class="status-card" id="status-card">
        ${this.renderStatusCard(todayCourses, isHoliday)}
      </div>

      <div class="home-section">
        <div class="section-header">
          <h2>今日课程</h2>
          <span class="section-count">${todayCourses.length} 节</span>
        </div>
        <div id="today-courses">
          ${todayCourses.length === 0 ? '<div class="empty-state">今天没有课</div>' : this.renderCoursesList(todayCourses)}
        </div>
      </div>

      <div class="home-section">
        <div class="section-header">
          <h2>今日日程</h2>
          <button class="btn btn-primary btn-small" id="add-today-event">＋</button>
        </div>
        <div id="today-events">
          ${todayEvents.length === 0 ? '<div class="empty-state">今天没有日程</div>' : this.renderEventsList(todayEvents)}
        </div>
      </div>
    `;

    this.bindEvents();
  },

  getTodayCourses() {
    const today = new Date();
    const weekday = today.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
    const weekNum = App.calendar.getWeekNumber(App.calendar.today());

    if (!weekNum || weekday === 0) return [];

    const courses = App.courses.coursesForWeek(weekNum);
    return courses
      .filter(c => c.day === weekday)
      .filter(c => {
        const dateStr = this.getDateForDay(weekday, weekNum);
        return !App.calendar.isHoliday(dateStr);
      })
      .sort((a, b) => a.periods[0] - b.periods[0]);
  },

  getDateForDay(weekday, weekNum) {
    const range = App.calendar.getWeekDateRange(weekNum);
    const mon = new Date(range.mon);
    const date = new Date(mon);
    date.setDate(mon.getDate() + (weekday - 1));
    return App.calendar.formatDate(date);
  },

  renderStatusCard(courses, isHoliday) {
    if (isHoliday) {
      return `<div class="status-holiday"> 今日节假日，好好休息！</div>`;
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    for (const course of courses) {
      const startPeriod = App.calendar.PERIODS[course.periods[0] - 1];
      const endPeriod = App.calendar.PERIODS[course.periods[1] - 1];
      const startMinutes = this.timeToMinutes(startPeriod.start);
      const endMinutes = this.timeToMinutes(endPeriod.end);

      if (currentTime >= startMinutes && currentTime <= endMinutes) {
        return `
          <div class="status-in-class">
            <div class="status-icon">▶</div>
            <div class="status-text">
              <div class="status-title">正在上课：${course.name}</div>
              <div class="status-detail">${course.room} · 下课 ${endPeriod.end}</div>
            </div>
          </div>
        `;
      }

      if (currentTime < startMinutes) {
        const minutesUntil = startMinutes - currentTime;
        return `
          <div class="status-next">
            <div class="status-icon">⏰</div>
            <div class="status-text">
              <div class="status-title">下一节 ${startPeriod.start} · 还有${minutesUntil}分钟</div>
              <div class="status-detail">${course.name} · ${course.room}</div>
            </div>
          </div>
        `;
      }
    }

    return `<div class="status-done">✓ 今日课程已结束</div>`;
  },

  timeToMinutes(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  },

  renderCoursesList(courses) {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    return courses.map(course => {
      const startPeriod = App.calendar.PERIODS[course.periods[0] - 1];
      const endPeriod = App.calendar.PERIODS[course.periods[1] - 1];
      const startMinutes = this.timeToMinutes(startPeriod.start);
      const endMinutes = this.timeToMinutes(endPeriod.end);

      let status = '';
      if (currentTime > endMinutes) status = 'ended';
      else if (currentTime >= startMinutes) status = 'current';

      return `
        <div class="course-card ${status}" data-course-id="${course.id}">
          <div class="course-time">
            <div class="course-period">第${course.periods[0]}–${course.periods[1]}节</div>
            <div class="course-time-range">${startPeriod.start}–${endPeriod.end}</div>
          </div>
          <div class="course-info">
            <div class="course-name">${course.name}</div>
            <div class="course-detail">${course.room} · ${course.teacher}</div>
          </div>
        </div>
      `;
    }).join('');
  },

  renderEventsList(events) {
    return events.map(event => {
      const timeStr = event.startTime + (event.endTime ? `–${event.endTime}` : '');
      return `
        <div class="event-item ${event.done ? 'done' : ''}">
          <label class="checkbox-label">
            <input type="checkbox" ${event.done ? 'checked' : ''} data-id="${event.id}" class="event-checkbox">
            <span>${event.title}</span>
          </label>
          <div class="event-time">${timeStr}</div>
          ${event.location ? `<div class="event-location">📍 ${event.location}</div>` : ''}
        </div>
      `;
    }).join('');
  },

  bindEvents() {
    document.querySelectorAll('.event-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const id = e.target.dataset.id;
        App.store.toggleDone(id);
        this.render();
      });
    });

    document.getElementById('add-today-event')?.addEventListener('click', () => {
      this.openQuickAddModal();
    });

    document.querySelectorAll('.course-card').forEach(card => {
      card.addEventListener('click', () => {
        App.router.navigate('#/timetable');
      });
    });
  },

  openQuickAddModal() {
    const today = App.calendar.today();
    const content = `
      <h3>快速新增日程</h3>
      <form id="quick-event-form">
        <div class="form-group">
          <label>标题 *</label>
          <input type="text" name="title" required>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>开始时间</label>
            <input type="time" name="startTime">
          </div>
          <div class="form-group">
            <label>结束时间</label>
            <input type="time" name="endTime">
          </div>
        </div>
        <div class="form-group">
          <label>地点</label>
          <input type="text" name="location">
        </div>
        <div class="form-actions">
          <button type="button" class="btn" onclick="App.modal.close()">取消</button>
          <button type="submit" class="btn btn-primary">创建</button>
        </div>
      </form>
    `;

    App.modal.open(content, {
      onOpen: (modalEl) => {
        const form = modalEl.querySelector('#quick-event-form');
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const formData = new FormData(form);
          const data = {
            title: formData.get('title').trim(),
            date: today,
            startTime: formData.get('startTime'),
            endTime: formData.get('endTime'),
            location: formData.get('location').trim(),
            notes: '',
            color: 1
          };

          if (!data.title) {
            alert('标题为必填项');
            return;
          }

          App.store.addEvent(data);
          App.modal.close();
          this.render();
        });
      }
    });
  },

  startAutoRefresh() {
    this.refreshTimer = setInterval(() => {
      if (App.router.current() === 'home') {
        this.render();
      }
    }, 60000);
  }
};
