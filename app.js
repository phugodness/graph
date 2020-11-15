const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const axios = require('axios');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);

// GRAPHQL: Create a schema and a root resolver:
const schema = buildSchema(`
    type User {
        name: String!
        age: Int!
    }

    type Query {
        users: [User]
    }
`);

const getUsers = async () => {
  try {
    const { data } = await axios.get('http://backend:3000/users');
    return data.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

const rootValue = {
  users: () => getUsers()
};

// Use those to handle incoming requests:
app.use(graphqlHTTP({
  schema,
  rootValue,
  graphiql: true,
}));


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
