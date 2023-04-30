import axios from 'axios';

// URL for Deployment

// const URL = "https://todoapi.pilexlaflex.com/todos";
// const URLRegister = "https://todoapi.pilexlaflex.com/users";
// const URLLogin = "https://todoapi.pilexlaflex.com/users/login";

// URL for Development

const URL = 'http://localhost:5000/todos';
const URLRegister = 'http://localhost:5000/users';
const URLLogin = 'http://localhost:5000/users/login';

const doRequest = async (httpVerb, url, payload) => {
    const token = localStorage.getItem('token');

    if (token) axios.defaults.headers[httpVerb]['authorization'] = token;
    axios.defaults.headers[httpVerb]['Content-Type'] = 'application/json;charset=utf-8';
    axios.defaults.headers[httpVerb]['Access-Control-Allow-Origin'] = '*';

    try {
        const response = await axios[httpVerb](url, payload);
        return response;
    } catch (error) {
        console.log(error, 'DB might be out of sync');
    }
};

export { doRequest, URL, URLRegister, URLLogin };
