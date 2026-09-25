// 全局命名空间
const App = {
  views: {},
  init() {
    if (typeof App.router !== 'undefined') {
      App.router.init();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
