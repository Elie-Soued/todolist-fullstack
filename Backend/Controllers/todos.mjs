import jwt from 'jsonwebtoken';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { DBUSER, DBHOST, DBNAME, DBPASS, DBPORT } = process.env;

const { Client } = pkg;
const client = new Client({
    user: DBUSER,
    host: DBHOST,
    database: DBNAME,
    password: DBPASS,
    port: DBPORT,
});

client.connect();

const create = async (req, res) => {
    const { todo } = req.body;
    const userId = req.user.id;

    try {
        const queryString = 'INSERT INTO "todoss" (todo, user_id) VALUES ($1,$2) RETURNING id;';
        const dbResponse = await client.query(queryString, [todo, userId]);
        res.json({
            code: 200,
            message: 'inserted todo correctly',
            data: dbResponse.rows[0],
        });
    } catch (e) {
        res.status(500).json({
            code: 500,
            message: 'Error trying to insert a new todo',
        });
    }
};

const getAll = async (req, res) => {
    const userId = req.user.id;
    try {
        const dbResponse = await client.query(`SELECT * FROM todoss WHERE user_id =${userId} `);
        res.json({
            code: 200,
            message: 'success',
            data: dbResponse.rows,
        });
    } catch (e) {
        console.error(Error(e));
        res.status(500);
    }
};

const updateById = async (req, res) => {
    const { id } = req.params;
    const { todo } = req.body;

    try {
        const queryString = 'UPDATE todoss SET todo = $1 WHERE id = $2';

        await client.query(queryString, [todo, id]);
        res.json({
            code: 200,
            message: 'updated todo correcty with id' + id,
        });
    } catch (e) {
        res.status(500).json({
            code: 500,
            message: 'Error trying to update todo with id' + id,
        });
    }
};

const deleteById = async (req, res) => {
    const { id } = req.params;

    try {
        const queryString = 'DELETE FROM "todoss" WHERE id=$1';
        await client.query(queryString, [id]);
        res.json({
            code: 200,
            message: 'deleted todo correctly with id ' + id,
        });
    } catch (e) {
        console.error(Error(e));
        res.status(500).json({
            code: 500,
            message: 'Error trying to delete a todo with id ' + id,
        });
    }
};

const getByID = async (req, res) => {
    const { id } = req.params;
    try {
        const dbResponse = await client.query('SELECT * FROM todoss WHERE id=$1', [id]);
        res.json({
            code: 200,
            message: 'success. Found todo with id ' + id,
            data: dbResponse.rows[0],
        });
    } catch (e) {
        console.error(Error(e));
        res.status(500);
    }
};

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403);
        }
        req.user = user;
        next();
    });
};

export { getByID, getAll, create, updateById, deleteById, authenticateToken };
