export default {
    Book: {
        author: (obj, args, context, info) => {
            return context.dataloaders.authorById.load(obj.author_id);
        }
    },
    Author: {
        books: (obj, args, context, info) => {
            return context.dataloaders.booksByAuthorsIds.load(obj.id);
        }
    },
    Query: { 
        authors: (obj, args, context, info) => {
            return context.models.Author.findAll( );
        },
        books: (obj, args, context, info) => {
            return context.models.Book.findAll();
        },
    },
    Mutation: {
        addAuthor: (obj, args, context, info) => {
            console.log(args)
            return context.models.Author.create({ 
                name: args.name,
                email: args.email,
            });
        },
    }    
};

