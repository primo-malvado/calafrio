
import React from 'react';
import ReactDOM from 'react-dom';

//import {ApolloClient} from 'apollo-client';
import ApolloClient from "apollo-boost";
import {InMemoryCache} from 'apollo-cache-inmemory';
//import {HttpLink} from 'apollo-link-http';
import {Query, ApolloProvider} from 'react-apollo';
import gql from 'graphql-tag';

import Pages from './pages';
import Login from './pages/login';
import {resolvers, typeDefs} from './resolvers';
 
// Set up our apollo-client to point at the server we created
// this can be local or a remote endpoint
const cache = new InMemoryCache();
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache,
  headers: {
    authorization: localStorage.getItem('token'),
    'client-name': 'Space Explorer [web]',
    'client-version': '1.0.0',
  },


/*
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql',
    headers: {
      authorization: localStorage.getItem('token'),
      'client-name': 'Space Explorer [web]',
      'client-version': '1.0.0',
    },
  }),
  */
  clientState: {
    resolvers,
    typeDefs,
    defaults: {
      isLoggedIn: !!localStorage.getItem('token'),
      cartItems: []
    }
  },




});



const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

 
ReactDOM.render(
  <ApolloProvider client={client}>
    <Query query={IS_LOGGED_IN}>
      {({data}) => (data.isLoggedIn ? <Pages /> : <Login />)}
    </Query>
  </ApolloProvider>,
  document.getElementById('root'),
);
