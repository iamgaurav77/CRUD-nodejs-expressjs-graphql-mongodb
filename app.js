const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { graphqlHTTP } = require('express-graphql');

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

const app = express();

app.use(bodyParser.json());


app.use(
    '/graphql',
    graphqlHTTP({
       schema: graphqlSchema,
       rootValue: graphqlResolver,
       graphiql: true,
       formatError(err) {
        if (!err.originalError) {
          return err;
        }
        const data = err.originalError.data;
        const message = err.message || 'An error occurred.';
        const code = err.originalError.code || 500;
        return { message: message, status: code, data: data };
      }
    })
);


mongoose.connect("mongodb://localhost:27017/practice",{ useNewUrlParser:true, useUnifiedTopology:true} )
.then(result => {
  app.listen(8080);
})
.catch((err) => console.log(err));