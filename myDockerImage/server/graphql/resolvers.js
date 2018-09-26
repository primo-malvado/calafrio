export default {
    Book: {
        author: (obj, args, context, info) => {
            
            
            
             return context.dataloaders.authorById.load(obj.author_id);
        }
    },
    Author: {
        books: (obj, args, context, info) => {
            //console.log(obj.id)
            return context.dataloaders.booksByAuthorsIds.load(obj.id);
            
            //return context.Book.findAll({where: {author_id: obj.id}});
        }
    },
  Query: { 
    authors: (obj, args, context, info) => {
        return context.Author.findAll();
        
    },
    books: (obj, args, context, info) => {
        return context.Book.findAll();
        
    },
  },
};

