var DataLoader = require('dataloader');
 


module.exports = function(store, models){

  return function createLoaders() {
    return {

      user: new DataLoader(ids => function(ids) {

         return store.table('users')
              .whereIn('id', ids)
              .select()
              .then(rows => ids.map(id => rows.find(x => x.id === id)));
     
        }(ids)),

      commentsByPostId: new DataLoader(ids => function(ids) {


        return models.Comment.where('post_id', 'in',  ids).fetchAll()
/*
       return store.table('comments')
            .whereIn('post_id',  ids)
            .select()*/
            .then(rows => { 
              return ids.map(id => rows.serialize().filter(x => x.post_id === id))

            });
   
      }(ids)),



      postsByAuthorId: new DataLoader(ids => function(ids) {

       return store.table('posts')
            .whereIn('author_id',  ids)
            .select()
            .then(rows => { 
              return ids.map(id => rows.filter(x => x.author_id === id))

            });
   
      }(ids)),



    };
  }



}

