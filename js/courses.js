App.courses = {
  COURSES: [
    // 周一
    { id: 1, name: '工程认识', teacher: '项森伟', room: '待确认', weeks: [7, 10], day: 1, periods: [2, 5], color: 1 },
    { id: 2, name: '综合法语(1)', teacher: '夏雯', room: '教学一号楼 5001', weeks: [2, 17], day: 1, periods: [6, 7], color: 2 },
    { id: 3, name: '综合法语实训(1)', teacher: 'Nicolas CHRISTIAENS', room: '教学一号楼 4007', weeks: [2, 17], day: 1, periods: [11, 12], color: 2 },

    // 周二
    { id: 4, name: '数学基础', teacher: '蔡毓麟', room: '科研一号楼 1040', weeks: [2, 17], day: 2, periods: [1, 2], color: 3 },
    { id: 5, name: '工程化学基础', teacher: '朱英', room: '教学一号楼 3004', weeks: [2, 15], day: 2, periods: [3, 4], color: 4 },
    { id: 6, name: '综合法语实训(1)', teacher: '朱佳琪', room: '教学?号楼 1003', weeks: [2, 17], day: 2, periods: [5, 5], color: 2 },
    { id: 7, name: '综合法语(1)', teacher: '夏雯', room: '教学一号楼 5001', weeks: [2, 17], day: 2, periods: [6, 7], color: 2 },

    // 周三
    { id: 8, name: '综合法语(1)', teacher: 'David Xavier Boudon', room: '教学一号楼 5006', weeks: [2, 17], day: 3, periods: [3, 4], color: 2 },
    { id: 9, name: '形势与政策', teacher: '王浩伟', room: '科研一号楼', weeks: [6, 6], day: 3, periods: [6, 7], color: 5 },
    { id: 10, name: '新时代中国特色社会主义思想概论', teacher: '董卓宁/李文', room: '科研一号楼', weeks: [2, 17], day: 3, periods: [6, 9], color: 5 },
    { id: 11, name: '大学生心理健康', teacher: '方瑶', room: '教学一号楼', weeks: [2, 2], day: 3, periods: [8, 9], color: 6 },
    { id: 12, name: '中国红色歌曲赏析与实践', teacher: '衣萌', room: '科研?号楼 5050', weeks: [2, 17], day: 3, periods: [11, 12], color: 4 },
    { id: 13, name: '中国红色歌曲赏析与实践', teacher: '衣萌', room: '科研?号楼 5050', weeks: [2, 17], day: 3, periods: [13, 14], color: 4 },

    // 周四
    { id: 14, name: '体育(1)', teacher: '邢登江', room: '杭州田径场', weeks: [2, 17], day: 4, periods: [1, 2], color: 6 },
    { id: 15, name: '基础英语(1)', teacher: '张乐兴', room: '教学二号楼 5004', weeks: [2, 17], day: 4, periods: [3, 4], color: 3 },
    { id: 16, name: '新时代中国特色社会主义思想概论', teacher: '孙润南/董卓宁', room: '科研一号楼 1040', weeks: [2, 17], day: 4, periods: [6, 9], color: 5 },
    { id: 17, name: '综合法语(1)', teacher: 'David Xavier Boudon', room: '教学一号楼 5006', weeks: [2, 17], day: 4, periods: [11, 12], color: 2 },

    // 周五
    { id: 18, name: '航空航天概论A', teacher: '贾玉红', room: '教学一号楼 2004', weeks: [2, 17], day: 5, periods: [4, 5], color: 1 },
    { id: 19, name: '数理基础法语(1)', teacher: '待定', room: '教学一号楼 4003', weeks: [10, 17], day: 5, periods: [6, 7], color: 2 },
    { id: 20, name: '大学英语', teacher: '王歆', room: '教学二号楼', weeks: [2, 9], day: 5, periods: [8, 10], color: 3 },

    // 周六
    { id: 21, name: '大学英语', teacher: '王歆', room: '教学二号楼', weeks: [10, 17], day: 6, periods: [8, 9], color: 3 }
  ],

  coursesForWeek(week) {
    return this.COURSES.filter(c => c.weeks[0] <= week && week <= c.weeks[1]);
  },

  coursesByDay(week) {
    const courses = this.coursesForWeek(week);
    const byDay = {};
    for (let i = 1; i <= 7; i++) {
      byDay[i] = courses.filter(c => c.day === i);
    }
    return byDay;
  },

  getCourseColor(colorIndex) {
    const colors = ['#1F1D1A', '#2E3A8C', '#5A5648', '#3D3A35', '#4A4F8A', '#6B6458'];
    return colors[(colorIndex - 1) % colors.length];
  }
};
