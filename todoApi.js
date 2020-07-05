const express = require('express');
const path = require('path');
const { response } = require('express');
const db = require('./src/queries');

const bodyParser = require('body-parser');
const app = express();
const dotenv = require('dotenv').config();

if (dotenv.error) {
  throw dotenv.error;
}

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended : true
  })
);

app.use((req, res, next) => {
  res.set({
    'Content-Type'                 : 'text/json',
    'Access-Control-Allow-Origin'  : '*',
    'Access-Control-Allow-Headers' :
      'Origin, X-Requested-With, Content-Type, Accept',
    'Access-Control-Allow-Methods' : 'GET, POST, OPTIONS, PUT, DELETE'
  });
  next();
});
// console.log(dotenv.parsed);

app.use(express.static(path.join(__dirname, 'src')));

app.get('/', (req, res) => {
  res.send(
    JSON.stringify(
      {
        info     : 'Todolist API',
        commands : {
          getTodos    : 'get /todos',
          getTodoById : 'get /todos/:id',
          createTodo  : 'post /todos',
          updateTodo  : 'post /todos/:id',
          deleteTodo  : 'delete /todos/:id'
        }
      },
      null,
      2
    )
  );
});

app.get('/todos', db.getTodos);
app.get('/todos/:id', db.getTodoById);
app.post('/todos', db.createTodo);
app.put('/todos/:id', db.updateTodo);
app.delete('/todos/:id', db.deleteTodo);

app.listen(process.env.PORT || 8080, () =>
  console.log(
    `Website running at http://${process.env.IP || 'localhost'}:${process.env
      .PORT || '8080'}`
  )
);