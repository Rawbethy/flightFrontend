import Form from './components/views/Form';
import Login from './components/views/Login';
import Signup from './components/views/Signup';

interface Route {
    path: string,
    component: React.ComponentType
}

const siteRoutes : Route[] = [
    {path: '/', component: Form},
    {path: '/signup', component: Signup},
    {path: '/login', component: Login}
]

export default siteRoutes;