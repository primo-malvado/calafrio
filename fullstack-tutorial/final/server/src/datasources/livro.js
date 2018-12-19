const { DataSource } = require('apollo-datasource');

class LivroAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }


  async getAll({autor_id}) {

    const res = await this.store.livros.findAll({
      where: { autor_id},
    });

    return res;

  }

}

module.exports = LivroAPI;
