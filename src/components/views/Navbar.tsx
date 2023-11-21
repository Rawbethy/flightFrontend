import React, {useEffect, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {useCookies} from 'react-cookie';
import {UserData} from '../../App';
import '../styles/navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const {userStatus, setUserStatus} = useContext(UserData);
    const [cookies, setCookie, removeCookie] = useCookies(['token']);

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

    const handleLogout = () => {
        setUserStatus((prevState) => ({
            ...prevState,
            username: null,
            status: false
        }));
        removeCookie('token');
        navigate('/');
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
                        <li><button className='navButton' onClick={(() => navigate('/'))}>Home</button></li>
                    </ul>
                    <div className="welcome">
                        <p>Welcome, {userStatus.username}!</p>
                    </div>
                    <ul id='right'>
                        <li><button className='navButton' id='Records' onClick={() => navigate('/prevSearches')}>Price Tracking</button></li>
                        <li><button className='logout' id='Logout' onClick={handleLogout}>Logout</button></li>
                    </ul>
                </nav>
            </div>
        )
    }

    return (
        <div className="nav">
            <nav id='navbar'>
                <ul id='left'>
                    <li><button className='navButton' onClick={(() => navigate('/'))}>Home</button></li>
                </ul>
                <ul id='right'>
                    <li><button className='login' onClick={(() => navigate('/login'))}>Login</button></li>
                </ul>
            </nav>
        </div>
    )
}

export default Navbar
