//./node_modules/.bin/knex seed:make $(date +%s)_users

/*
 649  ./node_modules/.bin/knex migrate:make create_comments

  659  ./node_modules/.bin/knex seed:make $(date +%s)_users

  665  ./node_modules/.bin/knex migrate:rollback
  668  ./node_modules/.bin/knex migrate:latest

  667  ./node_modules/.bin/knex seed:run 
*/



const data = {
  "users" : [
      {id: 1, name: 'Rui Costa', email:"rui.fajozes@gmail.com"},
      {id: 2, name: 'Mariana Cardoso', email:"mariana.fajozes@gmail.com"},
      {id: 3, name: 'Eva Costa', email:"eva.fajozes@gmail.com"},
      {id: 4, name: 'Apolo Costa', email:"apolo.fajozes@gmail.com"},
  ],
  "posts":[
      {id: 1,author_id:1, title :"titulo 1", body: "este post mitico"},
      {id: 2,author_id:1, title :"titulo 2", body: "este post mitico"},
      {id: 3,author_id:2, title :"titulo 3", body: "este post mitico"},
      {id: 4,author_id:4, title :"titulo 4", body: "este post mitico"},
      {id: 5,author_id:3, title :"titulo 4", body: "este post mitico"},
      {id: 6,author_id:3, title :"titulo 4", body: "este post mitico"},
      {id: 7,author_id:4, title :"titulo 4", body: "este post mitico"},
      {id: 8,author_id:2, title :"titulo 5", body: "este post mitico"},

    ],
  "comments":
    [
      {id:1, author_id:3, text:"um dois", post_id :1},
      {id:2, author_id:2, text:"um dois", post_id :7},
      {id:3, author_id:4, text:"um dois", post_id :3},
      {id:4, author_id:2, text:"um dois", post_id :2},
      {id:5, author_id:1, text:"um dois", post_id :5},
      {id:6, author_id:4, text:"um dois", post_id :1},
      {id:7, author_id:2, text:"um dois", post_id :3},
      {id:8, author_id:3, text:"um dois", post_id :5},
      {id:9, author_id:2, text:"um dois", post_id :3},
      {id:10, author_id:3, text:"um dois", post_id :2},
    ]
};



 
exports.seed = function(knex, Promise) {

  return knex('users').del()
    .then(function () {
      return knex('comments').del()
     })
    .then(function () {
      return knex('posts').del()
     })
    .then(function () {
      return knex('users').del()
     })
    .then(function () {
      return knex('users').insert(data.users)
     })
     .then(function () {
      return knex('posts').insert(data.posts)
     })
    .then(function () {
      return knex('comments').insert(data.comments)
     }) ;
};


