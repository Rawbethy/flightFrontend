import React, {useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useCookies} from 'react-cookie';
import {UserData} from '../../App';

const Logout = () => {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const {userStatus, setUserStatus} = useContext(UserData);
    console.log('Called');

    useEffect(() => {
        setUserStatus((prevState) => ({
            ...prevState,
            username: null,
            status: false
        }));
        removeCookie('token');
        navigate('/');
    }, [])
    
    return (<div>Logging out...</div>);
}

export default Logout;