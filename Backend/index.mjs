//Modules import
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

//Routes import
import todosRoute from './Routes/todos.mjs';
import usersRoute from './Routes/users.mjs';

dotenv.config();

//Constants Declaration
const { PORT } = process.env;
const app = express();
app.use(cors());

//Use Body Parser to format the body´s reponse
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Assigning a route file to a path
app.use('/todos', todosRoute);
app.use('/users', usersRoute);

app.get('/', (_, res) => res.send('Hello World'));

//Starting a server and make it listen to a specific port
app.listen(PORT, () => console.log(`Server running on port${PORT}`));
