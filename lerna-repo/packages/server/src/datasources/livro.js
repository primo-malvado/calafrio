const { DataSource } = require('apollo-datasource');

class LivroAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }


  getAll(query) {
    return  this.store.livros.findAll({
      where: query,
    });
  }

}

module.exports = LivroAPI;
