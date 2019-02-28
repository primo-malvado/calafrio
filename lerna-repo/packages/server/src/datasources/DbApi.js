const { DataSource } = require('apollo-datasource');

class DbApi extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }
  initialize(config) {
    this.context = config.context;
  }
 
  async getAllBooks(query) { 
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

  }



  async getAllAuthors(query) {
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
 
  async createAuthor(data) {
    return await this.store.Author.create(data);
  }




}

module.exports = DbApi;
