const { DataSource } = require('apollo-datasource');

class AutorAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }


  async getAll() {

    const res = await this.store.autores.findAll({
      where: { userId },
    });

    return res;

  }

}

module.exports = AutorAPI;
