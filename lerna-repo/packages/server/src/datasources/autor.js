const { DataSource } = require('apollo-datasource');
var DataLoader = require('dataloader');




class AutorAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;

/*
    this.scoreLoader = new Dataloader(keys => {
      return this.store.autores.findAll({ where: { id: keys } }).then(() => {
        //Map the results back so they are in the same order as keys
      })
    });
*/

  }

  initialize(config) {
    this.context = config.context;
  }





//score: ({ playthroughId }) => scoreLoader.load(playthroughId).then(getDataValues)

  async getAll() {

    const res = await this.store.autores.findAll({
     // where: { userId },
    });

    return res;

  }




}

module.exports = AutorAPI;
