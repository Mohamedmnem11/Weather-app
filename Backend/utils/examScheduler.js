const scheduleAll = (io) => {
  // مثال: جدولة امتحانات دورية
  console.log('Scheduling exams...');
  // يمكن إضافة منطق جدولة هنا باستخدام مكتبة مثل node-cron
  // مثال: إرسال إشعار عبر Socket.IO عند بدء امتحان
  io.to('exam_room').emit('examStarted', { message: 'Exam has started' });
};

module.exports = { scheduleAll };