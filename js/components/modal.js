App.modal = {
  open(content, opts = {}) {
    const root = document.getElementById('modal-root');
    root.innerHTML = '';

    const mask = document.createElement('div');
    mask.className = 'modal-mask';
    mask.onclick = () => this.close();

    const contentEl = document.createElement('div');
    contentEl.className = 'modal-content';

    if (typeof content === 'string') {
      contentEl.innerHTML = content;
    } else {
      contentEl.appendChild(content);
    }

    root.appendChild(mask);
    root.appendChild(contentEl);
    root.classList.add('active');

    if (opts.onOpen) opts.onOpen(contentEl);

    document.addEventListener('keydown', this.handleEsc);
  },

  close() {
    const root = document.getElementById('modal-root');
    root.classList.remove('active');
    root.innerHTML = '';
    document.removeEventListener('keydown', this.handleEsc);
  },

  handleEsc(e) {
    if (e.key === 'Escape') App.modal.close();
  }
};
