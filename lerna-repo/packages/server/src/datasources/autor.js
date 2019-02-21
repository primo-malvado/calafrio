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
    const res = this.store
      .from("Authors")
      .select();

    if(query && query.id !== undefined ){
      res.whereIn('id', query.id) // <-- only if param exists
    }
    
    const data = await res;
      


    const dt = this.context.loaders.autor;
    data.forEach(function(item){

      dt.prime(item.id, item);
    })

 
    return data;
  }

  async create(data) {
    return await this.store.Author.create(data);
  }
}

module.exports = AutorAPI;
