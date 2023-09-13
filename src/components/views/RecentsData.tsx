import {useState, useEffect, useContext} from 'react';
import {useParams} from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import axios from 'axios';

interface RecentData {
    dataID: string,
    price: string
}

export default function RecentsData() {
    const {urlID} = useParams();
    const [data, setData] = useState<Record<string, RecentData>>({})

    useEffect(() => {
        const getData = async () => {
            const res = await axios.post('https://flightapi.robert-duque.com:8080/getPrices', {
            // const res = await axios.post('http://localhost:8080/getPrices', {
                urlID: urlID 
            })
            setData(res.data)
        }
        getData();
    }, [])

    useEffect(() => {
        setData(data);
        console.log(data)
    }, [data])

    return (
        <div className="main" style={{color: 'white'}}>
            {Object.keys(data).map((element) => (
                <div className="entry">
                    <span>{data[element].dataID}</span>
                    <br />
                    <span>{data[element].price}</span>
                </div>
            ))}
        </div>
    )
}    
