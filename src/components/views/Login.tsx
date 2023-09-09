import React, {useState, useEffect, useContext, ChangeEvent, FormEvent} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {UserData} from '../../App';
import '../styles/login.css';

interface Credentials {
    username: string,
    password: string
}

export default function Login() {

    const navigate = useNavigate();
    const {userStatus, setUserStatus} = useContext(UserData);

    const formStyles: React.CSSProperties = {
        position: 'relative',
        display: 'flex',
        margin: 'auto',
        height: 'auto',
        maxWidth: '450px',
        borderRadius: '10px',
        borderStyle: 'solid',
        borderColor: 'rgba(245, 245, 245, 0.648)',
        borderWidth: '4px',
        transform: 'translateY(50%)'
    }

    const [creds, setCreds] = useState<Credentials>({
        username: '',
        password: ''
    })

    const updateState = (e: ChangeEvent<HTMLInputElement>) => {
        setCreds((prevCreds) => ({
            ...prevCreds,
            [e.target.name]: e.target.value
        }))
    }

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://flightapi.robert-duque.com:8080/login', {
                username: creds.username,
                password: creds.password
            });

            if(res.data.status) {
                setUserStatus((prevState) => ({
                    ...prevState,
                    username: creds.username,
                    status: true
                }))
                navigate('/')
            }
            else {
                alert(res.data.message)
            }
        }
        catch (error) {
            alert(error)
        }
    }

    useEffect(() => {
        setCreds(creds);
        setUserStatus(userStatus)
    }, [, userStatus, creds])

    const userData = useContext(UserData);
    if(!userData) {
        return <div>Loading or error handling...</div>
    }
    // const {setUserStatus} = userData;

    return (
        <div className="loginMain">
            <form onSubmit={submit} style={formStyles}>
                <div className="formMain">
                    <h2>Login: </h2>
                    <div className="inputBox">
                        <div className="inputLabel">
                            <label>Username</label>
                        </div>
                        <input type="text" className='textBox' id='textBox' name='username' value={creds.username} placeholder='Username' onChange={updateState}/>
                    </div>
                    <div className="inputBox">
                        <div className="inputLabel">
                            <label>Password</label>
                        </div>
                        <input type='password' className='textBox' id='textBox' name='password' value={creds.password} placeholder='Password' onChange={updateState}/>
                    </div>
                    <button type='submit' className='submitButton'>Login</button>
                    <div className="signupOption">
                        <p>Don't have an account? <u><a onClick={() => navigate('/signup')}>Signup</a></u></p>
                    </div>
                </div>
            </form>
        </div>
    )
}