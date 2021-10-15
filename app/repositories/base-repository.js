const ModelNotFoundException = require('../exceptions/model-not-found-exceptions');

class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findBy({ column, value }) {
    const where = {};
    where[column] = value;

    const record = await this.model.findOne({
      where,
    });

    if (!record) {
      throw new ModelNotFoundException(this.model.name.toLowerCase());
    }

    return record;
  }

  async getAll() {}

  async create(data) {
    return this.model.create(data);
  }

  async update() {}

  async destroy() {}
}

module.exports = BaseRepository;
