require('dotenv').config();
const { Pool, Client } = require('pg');
const { request } = require('express');
const pool = new Pool();

const getTodos = (request, response) => {
  pool.query('SELECT * FROM todolist ORDER BY id ASC', (err, results) => {
    if (err) {
      throw err;
    }
    // console.log(JSON.stringify(results.rows, null, 2));
    response.status(200).send(JSON.stringify(results.rows, null, 2));
  });
};

const getTodoById = (request, response) => {
  const id = parseInt(request.params.id);

  if (Number.isNaN(id)) {
    response
      .status(400)
      .send(
        JSON.stringify(
          { error: 'BAD REQUEST', reason: 'id must be an int' },
          null,
          2
        )
      );
  } else {
    pool.query('SELECT * FROM todolist WHERE id= $1', [ id ], (err, result) => {
      if (err) {
        throw err;
      }
      response.status(200).send(JSON.stringify(result.rows[0], null, 2));
    });
  }
};

const createTodo = (request, response) => {
  const { title, complete } = request.body;

  pool.query(
    'INSERT INTO todolist ( title, complete) VALUES ($1, $2) RETURNING id',
    [ title, complete ],
    (err, result) => {
      if (err) {
        throw err;
      }
      newTodo = {
        id        : result.rows[0].id,
        title     : title,
        completed : complete
      };
      // console.log(newTodo);
      response.status(201).send(newTodo);
    }
  );
};

const updateTodo = (request, response) => {
  const id = parseInt(request.params.id);
  const { title, complete } = request.body;

  if (Number.isNaN(id)) {
    response
      .status(400)
      .send(
        JSON.stringify(
          { error: 'BAD REQUEST', reason: 'id must be an int' },
          null,
          2
        )
      );
  } else {
    pool.query(
      'UPDATE todolist SET title = $1, complete = $2 WHERE id = $3',
      [ title, complete, id ],
      (err, result) => {
        if (err) {
          throw err;
        }
        response.status(200).send(`Todo updated with ID: ${id}`);
      }
    );
  }
};

const deleteTodo = (request, response) => {
  const id = parseInt(request.params.id);

  if (Number.isNaN(id)) {
    response
      .status(400)
      .send(
        JSON.stringify(
          { error: 'BAD REQUEST', reason: 'id must be an int' },
          null,
          2
        )
      );
  } else {
    pool.query('DELETE FROM todolist WHERE id=$1', [ id ], (err, result) => {
      if (err) {
        throw err;
      }
      // console.log(`Todo deleted with ID: ${id}`);
      response.status(200).send(`Todo deleted with ID: ${id}`);
    });
  }
};

module.exports = {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo
};
