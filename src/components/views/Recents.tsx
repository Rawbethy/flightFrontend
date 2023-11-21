import {useState, useEffect, useContext} from 'react';
import {Navigate, useNavigate} from 'react-router-dom';
import {useCookies} from 'react-cookie';
import {DateFormat} from '../Utils/DateFormat';
import { BeatLoader } from 'react-spinners';
import {UserData} from '../../App';
import axios from 'axios';
import '../styles/recents.css'

interface HistoryEntries {
    urlID: string,
    url: string,
    depCity: string,
    arrCity: string,
    depDate: Date,
    retDate: Date
}

export default function Recents() {

    const navigate = useNavigate();
    const {userStatus} = useContext(UserData);
    const [isLoading, setIsLoading] = useState(true);
    const [history, setHistory] = useState<Record<string, HistoryEntries>>({});
    const [cookies] = useCookies(['token'])

    const axiosInstance = axios.create({
        // baseURL: 'http://localhost:8080/getHistory',
        baseURL: 'https://flightapi.robert-duque.com:8080/getHistory',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${cookies.token}` 
        }
    })


    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // const res = await axiosInstance.post('http://localhost:8080/getHistory', {
                const res = await axios.post('https://flightapi.robert-duque.com:8080/getHistory', {
                    username: userStatus.username
                });
                if(res.data) {
                    setHistory(res.data.entries)
                }
            }
            catch(err) {
                console.log(err)
            }
            finally {
                setIsLoading(false);
            }
        }
        fetchHistory();
    }, [])

    useEffect(() => {
        setHistory(history);
        setIsLoading(isLoading);
    }, [history, isLoading])

    return (
        <div className="historyMain">
            {isLoading ? (
                <div className="loadingCircle">
                    <BeatLoader color="white" loading={isLoading} size={15}/>
                </div> 
            ) : (
                <table className="historyTable">
                    <thead>
                        <tr className='header'>
                            <th>Departure City</th>
                            <th>Destination City</th>
                            <th>Departure Date</th>
                            <th>Return Date</th>
                            <th>Current Prices</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(history).map((element) => (
                            <tr className='entryRow' key={element}>
                                <td>{history[element].depCity}</td>
                                <td>{history[element].arrCity}</td>
                                <td>{DateFormat(history[element].depDate)}</td>
                                <td>{DateFormat(history[element].retDate)}</td>
                                <td style={{textAlign: 'center'}}><button onClick={() => navigate(`/prevSearches/${history[element].urlID}`)}>Track</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}