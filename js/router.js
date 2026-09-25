App.router = {
  currentView: 'home',

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  },

  handleRoute() {
    const hash = window.location.hash || '#/home';
    const view = hash.replace('#/', '') || 'home';
    this.switchView(view);
  },

  navigate(hash) {
    window.location.hash = hash;
  },

  current() {
    return this.currentView;
  },

  switchView(viewName) {
    if (!['home', 'timetable', 'events'].includes(viewName)) {
      viewName = 'home';
    }

    this.currentView = viewName;

    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

    const viewEl = document.getElementById(`view-${viewName}`);
    const tabEl = document.querySelector(`.tab[data-view="${viewName}"]`);

    if (viewEl) viewEl.classList.add('active');
    if (tabEl) tabEl.classList.add('active');

    // 初始化视图
    if (viewName === 'home' && App.views.home) {
      App.views.home.init();
    } else if (viewName === 'timetable' && App.views.timetable) {
      App.views.timetable.init();
    } else if (viewName === 'events' && App.views.events) {
      App.views.events.init();
    }
  }
};
