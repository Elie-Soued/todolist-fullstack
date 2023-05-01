import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
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

const checkIfUserExists = async (req) => {
    const { username } = req.body;
    const result = await client.query('SELECT * FROM userss WHERE username = $1', [username]);
    const user = result.rows[0];
    return user;
};

const login = async (req, res) => {
    const { password } = req.body;
    const user = await checkIfUserExists(req);

    if (user === undefined) {
        res.json({
            code: 404,
            message: 'Account does not exist',
        });
        return;
    }

    try {
        const passwordIsMatching = await bcrypt.compare(password, user.password);

        if (passwordIsMatching) {
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
            res.send({ accessToken });
        } else {
            res.json({
                code: 401,
                message: 'Wrong Password',
            });
            return;
        }
    } catch (e) {
        res.status(500).send();
    }
};

const register = async (req, res) => {
    const { username, password } = req.body;
    const user = await checkIfUserExists(req);

    if (user) {
        res.json({
            code: 409,
            message: 'Account exists already',
        });
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const queryString = 'INSERT INTO "userss" (username, password) VALUES ($1,$2);';
        const dbResponse = await client.query(queryString, [username, hashedPassword]);
        res.json({
            code: 200,
            message: 'inserted user correctly',
            data: dbResponse.rows[0],
        });
    } catch (e) {
        res.status(500).json({
            code: 500,
            message: 'Error trying to insert a new user',
        });
    }
};

export { login, register };
