class BaseService {
  constructor(dao) {
    this.dao = dao;
  }

  async save(entity) {
    let newEntity = await this.dao.save(entity);
    return newEntity;
  }

  async getDocument(filter, populateFields) {
    return await this.dao.getDocument(filter, populateFields);
  }

  async getById(id, populateFields) {
    return await this.dao.getById(id, populateFields);
  }

  async getAll(populateFields) {
    return await this.dao.getAll(populateFields);
  }

  async update(id, entity) {
    return await this.dao.update(id, entity);
  }

  async deleteById(id) {
    return await this.dao.deleteById(id);
  }

  async deleteAll() {
    return await this.dao.deleteAll();
  }
}

module.exports = { BaseService };
