import express from 'express';

import { getByID, getAll, create, updateById, deleteById, authenticateToken } from '../Controllers/todos.mjs';

const todosRoute = express.Router();

todosRoute.get('/:id', authenticateToken, getByID);
todosRoute.get('/', authenticateToken, getAll);
todosRoute.post('/', authenticateToken, create);
todosRoute.put('/:id', authenticateToken, updateById);
todosRoute.delete('/:id', authenticateToken, deleteById);

export default todosRoute;
