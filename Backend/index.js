//Modules import
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');

//Routes import
const todosRoute = require('./Routes/todos');
const usersRoute = require('./Routes/users');

//Constants Declaration
const { PORT } = process.env;
const app = express();
app.use(cors());
const port = PORT;

//Use Body Parser to format the body´s reponse

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Assigning a route file to a path
app.use('/todos', todosRoute);
app.use('/users', usersRoute);

app.get('/', (req, res) => res.send('Hello World'));

//Starting a server and make it listen to a specific port
app.listen(port, () => console.log(`Server running on port${port}`));
