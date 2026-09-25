App.calendar = {
  SEMESTER_START: '2026-09-07',
  TOTAL_WEEKS: 19,

  PERIODS: [
    { n: 1, start: '08:00', end: '08:45', group: '上午' },
    { n: 2, start: '08:50', end: '09:35', group: '上午' },
    { n: 3, start: '09:50', end: '10:35', group: '上午' },
    { n: 4, start: '10:40', end: '11:25', group: '上午' },
    { n: 5, start: '11:30', end: '12:15', group: '上午' },
    { n: 6, start: '14:00', end: '14:45', group: '下午' },
    { n: 7, start: '14:50', end: '15:35', group: '下午' },
    { n: 8, start: '15:50', end: '16:35', group: '下午' },
    { n: 9, start: '16:40', end: '17:25', group: '下午' },
    { n: 10, start: '17:30', end: '18:15', group: '下午' },
    { n: 11, start: '19:00', end: '19:45', group: '晚上' },
    { n: 12, start: '19:50', end: '20:35', group: '晚上' },
    { n: 13, start: '20:40', end: '21:25', group: '晚上' },
    { n: 14, start: '21:30', end: '22:15', group: '晚上' }
  ],

  HOLIDAYS: {
    '2026-09-25': '中秋节',
    '2026-10-01': '国庆节',
    '2026-10-02': '国庆节',
    '2026-10-03': '国庆节',
    '2026-10-04': '国庆节',
    '2026-10-05': '国庆节',
    '2026-10-06': '国庆节',
    '2026-10-07': '国庆节'
  },

  getWeekNumber(dateStr) {
    const date = new Date(dateStr);
    const start = new Date(this.SEMESTER_START);
    const diffDays = Math.floor((date - start) / (1000 * 60 * 60 * 24));
    const week = Math.floor(diffDays / 7) + 1;
    if (week < 1 || week > this.TOTAL_WEEKS) return null;
    return week;
  },

  getWeekDateRange(week) {
    const start = new Date(this.SEMESTER_START);
    const mon = new Date(start);
    mon.setDate(start.getDate() + (week - 1) * 7);
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    return {
      mon: this.formatDate(mon),
      sun: this.formatDate(sun)
    };
  },

  isHoliday(dateStr) {
    return dateStr in this.HOLIDAYS;
  },

  getHolidayName(dateStr) {
    return this.HOLIDAYS[dateStr] || null;
  },

  periodsSpan(startN, endN) {
    const start = this.PERIODS[startN - 1];
    const end = this.PERIODS[endN - 1];
    return `${start.start}–${end.end}`;
  },

  formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  },

  today() {
    return this.formatDate(new Date());
  },

  weekday(dateStr) {
    const date = new Date(dateStr);
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[date.getDay()];
  }
};
