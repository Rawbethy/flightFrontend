import {useState, useEffect, useContext} from 'react';
import {useParams} from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import axios from 'axios';
import '../styles/priceChange.css'

interface RecentData {
    depTimes: string[],
    depFlightLen: string,
    depLayovers: string,
    retTimes: string[],
    retFlightLen: string,
    retLayovers: string,
    price: string
}

interface DBData {
    price: number
}

export default function PriceChange() {
    const {urlID} = useParams();
    const [data, setData] = useState<Record<string, RecentData>>({});
    const [dbData, setdbData] = useState<Record<string, DBData>>({})
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.post('https://flightapi.robert-duque.com:8080/getPrices', {
                // const res = await axios.post('http://localhost:8080/getPrices', {
                    urlID: urlID 
                })
                console.log(res.data);
                setData(res.data.pricesAndInfo);
                setdbData(res.data.dbData);
            }
            catch (err) {
                alert(err);
            }
            finally {
                setIsLoading(false);
            }
        }
        getData();
    }, [])

    useEffect(() => {
        setData(data);
        setdbData(dbData);
        setIsLoading(isLoading);
    }, [data, dbData, isLoading])

    return (
        <div className="priceChangeMain" style={{color: 'white'}}>
            {isLoading ? (
                <div className="loadingCircle">
                    <BeatLoader color="white" loading={isLoading} size={15}/>
                </div> 
            ) : (
                <table className="priceChangeTable">
                    <thead>
                        <tr className='header'>
                            <th>Departure Times</th>
                            <th>Departure Length</th>
                            <th>Departure Layovers</th>
                            <th>Return Times</th>
                            <th>Return Length</th>
                            <th>Return Layovers</th>                            
                            <th>Price</th>
                            <th>element</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(data).map((element) => (
                            <tr className='priceRow' key={element}>
                                <td>{data[element].depTimes[0]} - {data[element].depTimes[1]}</td>
                                <td>{data[element].depFlightLen}</td>
                                <td>{data[element].depLayovers}</td>
                                <td>{data[element].retTimes[0]} - {data[element].retTimes[1]}</td>
                                <td>{data[element].retFlightLen}</td>
                                <td>{data[element].retLayovers}</td>
                                <td>New Price: {data[element].price}</td>
                                <td>{dbData[element] ? `$${dbData[element].price.toString()}` : 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}    
