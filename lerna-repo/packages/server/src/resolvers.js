module.exports = {
  Query: {
    posts: (_, {},  context) =>{
      return context.dataSources.DbApi.store.from("posts").select();
    } ,
  },
  Post: {
    author: (post, {},  context) =>{
      return context.loaders.user.load(post.author_id);
    } ,
    comments: (post, {},  context) =>{
      return context.loaders.commentsByPostId.load(post.id);
    }     
  },
  User: {
    posts: (user, {},  context) =>{
      return context.loaders.postsByAuthorId.load(user.id);
      
      /*
      return context.dataSources.DbApi.store.from("posts")
      .where("author_id", user.id)
      .select();
      */
    } ,
  },  
  Comment: {
    author: (comment, {},  context) =>{
      return context.loaders.user.load(comment.author_id);
    } ,
  },
};

 