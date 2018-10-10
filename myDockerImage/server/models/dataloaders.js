var DataLoader = require('dataloader');


module.exports = (contexModel) =>  {
    
    var datal = {
        booksByAuthorsIds: new DataLoader(function(authorIds) {

                console.log("booksByAuthorsIds",authorIds)

                var promises = authorIds.map(function(author_id) {
                    return contexModel.Book.findAll({
                        where: {
                            author_id: author_id
                        }
                    });
                })
                return Promise.all(promises);
            }),
            authorById: new DataLoader(function(authorIds) {

                console.log("authorById",authorIds);
                return contexModel.Author.findAll({
                    where: {
                        id: authorIds
                    }
                });
            }),
            /*authorsAll: new DataLoader(function(xxx) {
                return contexModel.Author.findAll( );
            })*/
        }
        
    return datal;
}