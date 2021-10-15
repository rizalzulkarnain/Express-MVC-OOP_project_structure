const BaseTask = require('./base-task');
const { sequelize } = require('../../models');

class RemoveExpiredRefreshTokensTask extends BaseTask {
  async handle() {
    await sequelize.query(
      `DELETE FROM RefreshTokens where created_at < now()-'7 day'::interval`
    );
  }
}

module.exports = RemoveExpiredRefreshTokensTask;
