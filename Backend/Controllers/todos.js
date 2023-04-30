const jwt = require('jsonwebtoken');
const pool = require('../dbconfig');
require('dotenv').config();

module.exports = {
    create: async (req, res) => {
        const { todo } = req.body;
        const userId = req.user.id;

        try {
            const queryString = 'INSERT INTO "todoss" (todo, user_id) VALUES ($1,$2) RETURNING id;';
            const dbResponse = await pool.query(queryString, [todo, userId]);
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
    },

    getAll: async (req, res) => {
        const userId = req.user.id;
        try {
            const dbResponse = await pool.query(`SELECT * FROM todoss WHERE user_id =${userId} `);
            res.json({
                code: 200,
                message: 'success',
                data: dbResponse.rows,
            });
        } catch (e) {
            console.error(Error(e));
            res.status(500);
        }
    },

    updateById: async (req, res) => {
        const { id } = req.params;
        const { todo } = req.body;

        try {
            const queryString = 'UPDATE todoss SET todo = $1 WHERE id = $2';

            await pool.query(queryString, [todo, id]);
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
    },

    deleteById: async (req, res) => {
        const { id } = req.params;

        try {
            const queryString = 'DELETE FROM "todoss" WHERE id=$1';
            await pool.query(queryString, [id]);
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
    },

    getByID: async (req, res) => {
        const { id } = req.params;
        try {
            const dbResponse = await pool.query('SELECT * FROM todoss WHERE id=$1', [id]);
            res.json({
                code: 200,
                message: 'success. Found todo with id ' + id,
                data: dbResponse.rows[0],
            });
        } catch (e) {
            console.error(Error(e));
            res.status(500);
        }
    },

    authenticateToken: (req, res, next) => {
        const token = req.headers['authorization'];
        if (!token) return res.status(401);
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(403);
            }
            req.user = user;
            next();
        });
    },
};
