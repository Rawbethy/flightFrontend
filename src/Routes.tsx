import Form from './components/views/Form';
import Login from './components/views/Login';
import SignUp from './components/views/Signup';
import Recents from './components/views/Recents';
import PriceChange from './components/views/PriceChange'
import React from 'react';

interface Route {
    path: string,
    component: React.ComponentType
}

const siteRoutes : Route[] = [
    {path: '/', component: Form},
    {path: '/signup', component: SignUp},
    {path: '/login', component: Login},
    {path: '/prevSearches', component: Recents},
    {path: '/prevSearches/:urlID', component: PriceChange},
]

export default siteRoutes;