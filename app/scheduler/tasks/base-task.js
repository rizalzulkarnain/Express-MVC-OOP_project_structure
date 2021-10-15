class BaseTask {
  async handle() {
    this.info('Empty Task!');
  }

  info(message) {
    console.log(message);
  }

  saveLog(message) {}
}

module.exports = BaseTask;
