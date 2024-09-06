const express = require('express');

const todoRoute = express.Router();

const { addTodo , showTodoPage , updateTodo , updateFiled , deleteTodo, completeTodo} = require('../controller/todo.controller');

todoRoute.get('/',showTodoPage);
todoRoute.get('/updateFiled/:id',updateFiled);
todoRoute.post('/',addTodo);
todoRoute.post('/updateFiled/updateTodo/:id',updateTodo);

todoRoute.post('/deleteTodo/:id',deleteTodo);

todoRoute.post('/completeTodo/:id',completeTodo);

module.exports = todoRoute;
