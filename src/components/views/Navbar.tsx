import React, {useEffect, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {UserData} from '../../App';
import '../styles/navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const {userStatus, setUserStatus} = useContext(UserData);

    const hideNav = () => {
        let theEnd = 0;
        var navbar = document.getElementById('navbar') as HTMLElement;
    
        if(navbar !== null) {
            window.addEventListener('scroll', function() {
                var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                if(scrollTop > theEnd) {
                    navbar.style.top = '-50px';
                }
                else {
                    navbar.style.top = '0';
                }
                theEnd = scrollTop;
            })
        }
    }

    const signOut = () => {
        setUserStatus((prevState) => ({
            ...prevState,
            username: null,
            status: false
        }));
        window.location.reload();
    }

    useEffect(() => {
        hideNav();
    }, [])


    if(userStatus.status) {
        return (
            <div className="nav">
                <nav id='navbar'>
                    <ul id='left'>
                        <li><button onClick={(() => navigate('/'))}>Home</button></li>
                    </ul>
                    <div className="welcome">
                        <p>Welcome, {userStatus.username}!</p>
                    </div>
                    <ul id='right'>
                        <li><button id='Records' onClick={() => navigate('/Recents')}>Price Tracking</button></li>
                        <li><button id='SignOut' onClick={signOut}>Sign Out</button></li>
                    </ul>
                </nav>
            </div>
        )
    }

    return (
        <div className="nav">
            <nav id='navbar'>
                <ul id='left'>
                    <li><button onClick={(() => navigate('/'))}>Home</button></li>
                </ul>
                <ul id='right'>
                <li><button id='SignIn' onClick={(() => navigate('/login'))}>Login</button></li>
                </ul>
            </nav>
        </div>
    )
}

export default Navbar
