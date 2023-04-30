import React, { useState, useEffect } from 'react';
import '../NewTaskForm/styles.css';
import './style.css';
import '../TodoTask/styles.css';
import { doRequest, URLRegister, URLLogin } from '../../ServiceUtils.js';
import { useNavigate } from 'react-router-dom';
import eye from '../../img/eye-solid.svg';

export default function LoginPage() {
    let [username, setUsername] = useState('');
    let [password, setPassword] = useState('');
    let [passwordType, setPasswordType] = useState('password');
    let [submitButton, setSubmitButton] = useState('Login');
    let [errorMessage, setErrorMessage] = useState('');
    let [hide, setHide] = useState(false);
    let navigate = useNavigate();

    const token = localStorage.getItem('token');

    const login = async () => {
        const response = await doRequest('post', URLLogin, {
            username,
            password,
        });

        if (response.data.code === 404) {
            setErrorMessage(response.data.message);
        } else if (response.data.code === 401) {
            setErrorMessage(response.data.message);
        } else {
            setTokenAndNavigate(response);
        }
    };

    const registerOrLogin = async () => {
        if (submitButton === 'Login') {
            login();
        } else {
            const response = await doRequest('post', URLRegister, {
                username,
                password,
            });

            if (response.data.code === 409) {
                setErrorMessage(response.data.message);
            } else {
                login();
            }
        }
    };

    const toggleButton = () => {
        if (submitButton === 'Login') {
            setSubmitButton('Register');
            setHide(true);
        } else {
            setSubmitButton('Login');
        }
    };

    const setTokenAndNavigate = (response) => {
        const token = response?.data.accessToken;
        localStorage.setItem('token', token);
        navigate('/todos');
    };

    const togglePasswordType = () => {
        if (passwordType === 'password') {
            setPasswordType('text');
            console.log(passwordType);
        } else {
            setPasswordType('password');
        }
    };

    useEffect(() => {
        if (token) {
            navigate('/todos');
        }
    }, []);

    return (
        <>
            <div className='main '>
                <h1>
                    <span>My</span>
                    <span>todo</span>
                    <span>LIST</span>
                </h1>

                <span className='errorSpan'>
                    <h3>{errorMessage}</h3>
                </span>

                <div className='formContainer'>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (username.length < 5) {
                                setErrorMessage('username is too short');
                            } else if (password.length < 5) {
                                setErrorMessage('password is too short');
                            } else {
                                setUsername('');
                                setPassword('');
                                registerOrLogin();
                            }
                        }}
                    >
                        <div className='container'>
                            <input
                                className='inputLogin'
                                onClick={() => {
                                    setErrorMessage('');
                                }}
                                value={username}
                                type='text'
                                maxlength='15'
                                placeholder='Enter username'
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                }}
                            />

                            <div className='relative'>
                                <input
                                    className='inputLogin relative'
                                    onClick={() => {
                                        setErrorMessage('');
                                    }}
                                    value={password}
                                    type={passwordType}
                                    maxlength='15'
                                    placeholder='Enter Password'
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                />

                                <img
                                    className='showPassword absolute'
                                    onClick={() => {
                                        togglePasswordType();
                                    }}
                                    src={eye}
                                    alt='SVG'
                                />
                            </div>

                            {/* <h4 className="forgotPasswordContainer">
              <span>
                <a
                  className="forgotPassword"
                  href="https://fontawesome.com/license"
                >
                  Forgot password?
                </a>{" "}
              </span>
            </h4> */}
                            <button
                                disabled={username === '' || password === ''}
                                className={`inputLogin  ${submitButton === 'Register' ? 'registerButton' : ''}`}
                                type='submit'
                            >
                                {submitButton}
                            </button>
                        </div>
                    </form>

                    <div className={`${hide ? 'hide' : 'createAccountContainer'}`}>
                        <h3>
                            <span>Not registered yet? </span>
                        </h3>
                        <h3>
                            <span>
                                {' '}
                                <h3
                                    className='createAccount'
                                    onClick={() => {
                                        toggleButton();
                                    }}
                                >
                                    Create an account
                                </h3>{' '}
                            </span>
                        </h3>
                    </div>
                    <i className='license'>
                        icons by fontawesome - <a href='https://fontawesome.com/license'>license</a>
                    </i>
                </div>
            </div>
        </>
    );
}
