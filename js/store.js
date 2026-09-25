App.store = {
  STORAGE_KEY: 'ms.events.v1',

  loadEvents() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveEvents(events) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events));
  },

  addEvent(eventData) {
    if (!eventData.title || !eventData.title.trim()) {
      throw new Error('标题不能为空');
    }
    if (eventData.startTime && eventData.endTime && eventData.endTime <= eventData.startTime) {
      throw new Error('结束时间必须晚于开始时间');
    }
    const events = this.loadEvents();
    const event = {
      id: Date.now().toString(),
      ...eventData,
      done: false
    };
    events.push(event);
    this.saveEvents(events);
    return event.id;
  },

  updateEvent(id, eventData) {
    const events = this.loadEvents();
    const index = events.findIndex(e => e.id === id);
    if (index !== -1) {
      events[index] = { ...events[index], ...eventData };
      this.saveEvents(events);
    }
  },

  deleteEvent(id) {
    const events = this.loadEvents();
    const filtered = events.filter(e => e.id !== id);
    this.saveEvents(filtered);
  },

  toggleDone(id) {
    const events = this.loadEvents();
    const event = events.find(e => e.id === id);
    if (event) {
      event.done = !event.done;
      this.saveEvents(events);
    }
  },

  eventsOnDate(dateStr) {
    const events = this.loadEvents();
    return events.filter(e => e.date === dateStr);
  }
};
