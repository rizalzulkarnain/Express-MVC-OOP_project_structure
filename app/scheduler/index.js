const cron = require('node-cron');

class Scheduler {
  constructor(cron) {
    this.cron = cron;
    this.tasks = {
      '* * * * *': [require('./tasks/remove-expired-refresh-tokens-task')],
    };
  }

  runTasks() {
    for (const [interval, tasks] of Object.entries(this.tasks)) {
      for (const task of tasks) {
        try {
          this.cron.schedule(interval, async () => {
            await new task().handle();
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
}

module.exports = new Scheduler(cron);
