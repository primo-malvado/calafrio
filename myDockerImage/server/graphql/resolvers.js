export default {
    Book: {
        author: (obj, args, context, info) => {
            
            //return context.Author.findOne({where: {id: obj.author_id}});
            return context.dataloaders.authorById.load(obj.author_id);
        }
    },
    Author: {
        books: (obj, args, context, info) => {
            
            //return context.Book.findAll({where: {author_id: obj.id}});
            return context.dataloaders.booksByAuthorsIds.load(obj.id);
            
        }
    },
  Query: { 
    authors: (obj, args, context, info) => {
        return context.Author.findAll( );
        
    },
    books: (obj, args, context, info) => {
        return context.Book.findAll();
        
    },
  },
};

