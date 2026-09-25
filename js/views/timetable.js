App.views.timetable = {
  currentWeek: null,

  init() {
    const week = App.calendar.getWeekNumber(App.calendar.today());
    this.currentWeek = week || 1;
    this.render();
  },

  render() {
    const container = document.getElementById('view-timetable');
    if (!container) return;

    const range = App.calendar.getWeekDateRange(this.currentWeek);
    const weekNum = this.currentWeek;

    container.innerHTML = `
      <div class="timetable-toolbar">
        <button class="btn" id="prev-week" ${weekNum <= 1 ? 'disabled' : ''}>‹</button>
        <span class="week-label">第 ${weekNum} 周</span>
        <button class="btn" id="next-week" ${weekNum >= 19 ? 'disabled' : ''}>›</button>
        <span class="date-range">${range.mon} – ${range.sun}</span>
        <button class="btn btn-primary" id="back-to-current">回本周</button>
      </div>
      <div id="holiday-notice"></div>
      <div class="timetable-grid">
        <div class="grid-header">
          <div class="period-label">节次</div>
          <div>周一</div><div>周二</div><div>周三</div><div>周四</div><div>周五</div><div>周六</div><div>周日</div>
        </div>
        <div class="grid-body" id="grid-body"></div>
      </div>
    `;

    this.renderGrid();
    this.renderHolidayNotice();
    this.bindEvents();
  },

  renderGrid() {
    const gridBody = document.getElementById('grid-body');
    if (!gridBody) return;

    const coursesByDay = App.courses.coursesByDay(this.currentWeek);
    const today = App.calendar.today();
    const todayWeekday = new Date(today).getDay();

    let html = '';
    for (let period = 1; period <= 14; period++) {
      const periodInfo = App.calendar.PERIODS[period - 1];
      const groupLabel = periodInfo.group;

      html += `<div class="grid-row" data-period="${period}">`;
      html += `<div class="period-cell">${period}<br><small>${periodInfo.start}</small></div>`;

      for (let day = 1; day <= 7; day++) {
        const dateStr = this.getDateForDay(day);
        const isHoliday = App.calendar.isHoliday(dateStr);
        const isToday = (day === todayWeekday);

        if (isHoliday) {
          html += `<div class="grid-cell holiday" data-day="${day}" data-period="${period}">休</div>`;
        } else {
          const courses = coursesByDay[day].filter(c => c.periods[0] <= period && period <= c.periods[1]);
          const isStartPeriod = courses.length > 0 && courses[0].periods[0] === period;

          if (isStartPeriod) {
            const course = courses[0];
            const rowSpan = course.periods[1] - course.periods[0] + 1;
            const color = App.courses.getCourseColor(course.color);
            html += `<div class="grid-cell course" style="grid-row: span ${rowSpan}; background: ${color}20; border-left: 3px solid ${color};" data-course-id="${course.id}" data-day="${day}" data-period="${period}">
              <div class="course-name">${course.name}</div>
              <div class="course-room">${course.room}</div>
            </div>`;
          } else if (courses.length === 0) {
            html += `<div class="grid-cell ${isToday ? 'today' : ''}" data-day="${day}" data-period="${period}"></div>`;
          }
        }
      }

      html += `</div>`;
    }

    gridBody.innerHTML = html;
    this.bindCourseClicks();
  },

  getDateForDay(day) {
    const range = App.calendar.getWeekDateRange(this.currentWeek);
    const mon = new Date(range.mon);
    const date = new Date(mon);
    date.setDate(mon.getDate() + (day - 1));
    return App.calendar.formatDate(date);
  },

  renderHolidayNotice() {
    const notice = document.getElementById('holiday-notice');
    if (!notice) return;

    const range = App.calendar.getWeekDateRange(this.currentWeek);
    const mon = new Date(range.mon);
    const sun = new Date(range.sun);
    const holidays = [];

    for (let d = new Date(mon); d <= sun; d.setDate(d.getDate() + 1)) {
      const dateStr = App.calendar.formatDate(d);
      if (App.calendar.isHoliday(dateStr)) {
        const name = App.calendar.getHolidayName(dateStr);
        if (!holidays.includes(name)) holidays.push(name);
      }
    }

    if (holidays.length > 0) {
      notice.innerHTML = `<div class="holiday-bar">⚠ 本周含节假日：${holidays.join('、')}（节假日不上课）</div>`;
    }
  },

  bindEvents() {
    document.getElementById('prev-week')?.addEventListener('click', () => {
      if (this.currentWeek > 1) {
        this.currentWeek--;
        this.render();
      }
    });

    document.getElementById('next-week')?.addEventListener('click', () => {
      if (this.currentWeek < 19) {
        this.currentWeek++;
        this.render();
      }
    });

    document.getElementById('back-to-current')?.addEventListener('click', () => {
      const week = App.calendar.getWeekNumber(App.calendar.today());
      if (week) {
        this.currentWeek = week;
        this.render();
      }
    });
  },

  bindCourseClicks() {
    document.querySelectorAll('.grid-cell.course').forEach(cell => {
      cell.addEventListener('click', () => {
        const courseId = parseInt(cell.dataset.courseId);
        const course = App.courses.COURSES.find(c => c.id === courseId);
        if (course) {
          this.showCourseDetail(course);
        }
      });
    });
  },

  showCourseDetail(course) {
    const content = `
      <h3>${course.name}</h3>
      <p><strong>教师：</strong>${course.teacher}</p>
      <p><strong>教室：</strong>${course.room}</p>
      <p><strong>周次：</strong>第 ${course.weeks[0]}–${course.weeks[1]} 周</p>
      <p><strong>节次：</strong>第 ${course.periods[0]}–${course.periods[1]} 节 (${App.calendar.periodsSpan(course.periods[0], course.periods[1])})</p>
      <button class="btn btn-primary" onclick="App.modal.close()" style="margin-top: 16px; width: 100%;">关闭</button>
    `;
    App.modal.open(content);
  }
};
