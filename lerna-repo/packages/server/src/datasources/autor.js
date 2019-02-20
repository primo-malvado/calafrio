const { DataSource } = require('apollo-datasource');

class AutorAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;

  }

  initialize(config) {
    this.context = config.context;
  }

  async getAll(query) {

    const res = await this.store.Author.findAll({
     where: query,
    });
 
    const dt = this.context.loaders.autor;
    res.forEach(function(item){

      dt.prime(item.id, item);
    })
    return res;
  }

  async create(data) {
    return await this.store.Author.create(data);
  }
 





}

module.exports = AutorAPI;
