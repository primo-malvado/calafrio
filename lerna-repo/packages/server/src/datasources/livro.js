const { DataSource } = require('apollo-datasource');

class LivroAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }


  async getAll(query) { 

 
    const res =  this.store.select().from("Books");


    if(query && query.AuthorId !== undefined ){
      res.whereIn('AuthorId', query.AuthorId);
    }



    const data = await res;
      


    const dt = this.context.loaders.livro;
    data.forEach(function(item){

      dt.prime(item.id, item);
    })

 
    return data;




/*

    return  this.store.Book.findAll({
      where: query,
    });
    */
  }

}

module.exports = LivroAPI;
