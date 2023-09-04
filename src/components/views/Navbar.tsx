import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = () => {
    const navigate = useNavigate();

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

    useEffect(() => {
        hideNav();
    }, [])

  return (
    <div className="nav">
        <nav id='navbar'>
            <ul id='Buttons'>
                <li><button onClick={(() => navigate('/'))}>Home</button></li>
            </ul>
            <ul id='login'>
              <li><button id='SignIn' onClick={(() => navigate('/login'))}>Sign In</button></li>
            </ul>
        </nav>
    </div>
  )
}

export default Navbar
