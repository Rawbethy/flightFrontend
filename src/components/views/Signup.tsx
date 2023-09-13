import React, {useState, useEffect, useContext, FormEvent, ChangeEvent} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {UserData} from '../../App';
import '../styles/signup.css'

interface Credentials {
    email: string,
    username: string,
    password: string
}

const formStyles: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    margin: 'auto',
    height: 'auto',
    width: '350px',
    maxWidth: '450px',
    borderRadius: '10px',
    borderStyle: 'solid',
    borderColor: 'rgba(245, 245, 245, 0.648)',
    borderWidth: '4px',
    transform: 'translateY(50%)',
    padding: '0px 30px 0px 30px'
}

export default function SignUp() {

    const navigate = useNavigate();

    // const [isLoading, setIsLoading] = useState(false);
    const {userStatus, setUserStatus} = useContext(UserData);
    const [creds, setCreds] = useState<Credentials>({
        email: '',
        username: '',
        password: ''
    })

    const updateState = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setCreds((prevCreds) => ({
            ...prevCreds,
            [e.target.name]: e.target.value
        }))
    }

    const submitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            // const res = await axios.post('http://localhost:8080/register', {
            const res = await axios.post('https://flightapi.robert-duque.com:8080/register', {
                username: creds.username,
                email: creds.email,
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
        } catch (error) {
            alert(error);
        }
    }

    useEffect(() => {
        setCreds(creds)
        setUserStatus(userStatus);
    }, [creds, userStatus])

    return (
        <div className="signupMain">
            <form onSubmit={submitForm} style={formStyles}>
                <div className="formMain">
                    <h2>Sign Up: </h2>
                    <div className="inputBox">
                        <div className="inputLabel">
                            <label>Email</label>
                        </div>
                        <input type="text" className='textBox' id='textBox' name='email' value={creds.email} placeholder='Email' onChange={updateState}/>
                    </div>
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
                        <input type="password" className='textBox' id='textBox' name='password' value={creds.password} placeholder='Password' onChange={updateState}/>
                    </div>
                    <button type='submit' className='submitButton' style={{width: 'auto', marginTop: '30px', marginBottom: '30px'}}>Sign Up</button>                    
                </div>
            </form>
        </div>
    )
}