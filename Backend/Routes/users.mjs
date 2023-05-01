import express from 'express';
import { register, login } from '../Controllers/users.mjs';

const usersRoute = express.Router();
usersRoute.post('/', register);
usersRoute.post('/login', login);

export default usersRoute;
