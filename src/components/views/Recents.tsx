import {useState, useEffect, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {UserData} from '../../App';
import axios from 'axios';

export default function Recents() {
    const {userStatus} = useContext(UserData);
    const [history, setHistory] = useState<string[]>([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // const res = await axios.post('http://localhost:8080/getHistory', {
                const res = await axios.post('https://flightapi.robert-duque.com:8080/getHistory', {
                    username: userStatus.username
                });
                if(res.data) {
                    console.log(res.data.urls)
                    setHistory(res.data.urls)
                }
            }
            catch(err) {
                console.log(err)
            }
        }
        fetchHistory();
    }, [])

    useEffect(() => {
        setHistory(history);
        console.log(history);
    }, [history])

    return (
        <div className="mainDiv">
            {history.map((element, index) => (
                <div className="yes" key={index} style={{color: 'white'}}>{element}</div>
            ))}
        </div>
    )
}