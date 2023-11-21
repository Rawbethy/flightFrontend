import axios from 'axios';
import {useCookies} from 'react-cookie';

export default function axiosAPIs() {
    const baseURL = 'http://localhost:8080';
    const [cookies] = useCookies(['token'])
    
    const createInstance = (url: string, token: string | null) => {
        const newURL = `${url !== '' ? `${baseURL}/${url}` : `${baseURL}`}`
        return axios.create({
          baseURL: `${newURL}`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}` 
          }
        });
    };
    const airlineAPI = createInstance('url', null);
    const registerAPI = createInstance('register', cookies.token);
    const loginAPI = createInstance('login', cookies.token);
    const getPricesAPI = createInstance('getPrices', cookies.token);
    const getHistoryAPI = createInstance('getHistory', cookies.token);
}
