import React, {useState, useEffect, useContext, FormEvent} from 'react';
import { BeatLoader } from 'react-spinners';
import AutofillInput from '../Utils/autofill';
import {ContextData} from '../../App'
import {DateFormat, AddDays, MonthFirstDate} from '../Utils/DateFormat';
import axios from 'axios';

import '../styles/form.css'

interface CardInfo {
    depAirline: string,
    depTimes: string[],
    depFlightLen: string,
    retAirline: string,
    retTimes: string[],
    retFlightLen: string,
    layoversTo: {
        layoverCount: string,
        layoverPorts: string[],
        layoverLengths: string[]
    },
    layoversFrom: {
        layoverCount: string,        
        layoverPorts: string[],
        layoverLengths: string[]
    },
    link: string,
    price: string
}

export default function Form() {

    const parseTime = (timeString: string) => {
        const [time, ampm] = timeString.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        const isPM = ampm.toLowerCase() == 'pm';

        let totalMinutes = hours * 60 + minutes;
        if(isPM && hours !== 12) {
            totalMinutes += 12 * 60;
        }
        else if(!isPM && hours === 12) {
            totalMinutes -= 12 * 60
        }
        return totalMinutes;
    }

    const totalMinutesCalc = (timeString: string) => {
        var [hours, minutes] = timeString.split(' ');
        const hourInt = parseInt(hours.slice(0, 2));
        const minuteInt = parseInt(minutes.slice(0, 2)); 
        return hourInt * 60 + minuteInt;
    }

    const handleLinkClick = (link: string) => {
        const kayakInd = link.indexOf("kayak");
        const newLink = "https://" + link.substring(kayakInd);
        const anchor = document.createElement('a');
        anchor.href = newLink
        anchor.target = "_blank"
        anchor.click()
    }

    const sortResults = () => {
        const sortedResults = Object.values(results).sort((a, b) => {
            if(sortingOption === "priceL2H") {
                return parseInt(a.price.replace(",", "").slice(1, a.price.length)) - parseInt(b.price.replace(",", "").slice(1, b.price.length));
            }
            else if(sortingOption === "priceH2L") {
                return parseInt(b.price.replace(",", "").slice(1, b.price.length)) - parseInt(a.price.replace(",", "").slice(1, a.price.length));
            }
            else if(sortingOption === "depTimeL2H") {
                return parseTime(a.depTimes[0]) - parseTime(b.depTimes[0]);
            }
            else if(sortingOption === "depTimeH2L") {
                return parseTime(b.depTimes[0]) - parseTime(a.depTimes[0]);
            }
            else if(sortingOption === "totalTravelTimeL2H") {
                return (totalMinutesCalc(a.depFlightLen) + totalMinutesCalc(a.retFlightLen)) - (totalMinutesCalc(b.depFlightLen) + totalMinutesCalc(b.retFlightLen))
            }
            else if(sortingOption === "totalTravelTimeH2L") {
                return (totalMinutesCalc(b.depFlightLen) + totalMinutesCalc(b.retFlightLen)) - (totalMinutesCalc(a.depFlightLen) + totalMinutesCalc(a.retFlightLen))
            }
            return 0;
        })
        return sortedResults;
    }

    const {values, setValues} = useContext(ContextData);

    const [errors, setErrors] = useState({
        dates: ''
    });

    const [results, setResults] = useState<Record<string, CardInfo>>({});
    const [sortingOption, setSortingOption] = useState("priceL2H");
    const [isLoading, setIsLoading] = useState(false);

    function validateDates(values: any) {
        if(values['depDate'] > values['retDate']) {
            setErrors(errors => ({
                ...errors,
                dates: 'Return date needs to be after departure date'
            }))
        }
        else if(errors.dates !== '' && values['depDate'] < values['retDate']) {
            setErrors(errors => ({
                ...errors,
                dates: ''
            }))
        }
    }

    function handleDateUpdate(e: React.ChangeEvent<HTMLInputElement>) {
        e.persist();
        const {name, value} = e.target
        if (name === 'depDate') {
            setValues((prevValues) => ({
                ...prevValues,
                retDate: AddDays(value, 3)
            }))
        }
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }))
    };

    const handleSubmit = async(e: FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const res = await axios.post('http://ec2-18-188-4-231.us-east-2.compute.amazonaws.com:8080/airlineAPI', {
                depPort: values.depPort,
                arrPort: values.arrPort,
                depDate: values.depDate,
                retDate: values.retDate
            });
            setResults(res.data);        
        } catch (error) {
            alert(error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        setValues(values);
        validateDates(values);
        setResults(results);
        console.log(results);
    }, [values, results]);

    const currDate = DateFormat(new Date());
    
    return (
        <div className="main">
            <div className="form-container">
                <form autoComplete='off'>
                    <div className="cities">
                        <div className='cityInput'>
                            <label htmlFor="">Departure City</label>
                            <AutofillInput dest='depCity'/>
                        </div>
                        <div className='cityInput'>
                            <label htmlFor="">Arrival City</label>
                            <AutofillInput dest='arrCity'/>
                        </div>
                    </div>
                    <br />
                    <div className='dates'>
                        <div className='depDate'>
                            <label htmlFor="">Departure Date</label>
                            <div>
                                <input value={values.depDate} type="date" name='depDate' min={currDate} onChange={handleDateUpdate}/>
                            </div>                       
                        </div>
                        <div className='retDate'>
                            <label htmlFor="">Return Date</label>
                            <div>
                                <input value={values.retDate} type="date" name='retDate' min={currDate} onChange={handleDateUpdate}/>
                            </div>
                        </div>
                    </div>
                    <div className="errorMsg">
                        {errors.dates && <span style={{position: 'relative', color: 'red', fontSize: '14px', padding: '10px 0'}}>{errors.dates}</span> }
                    </div>
                    <div className="submitButton">
                        <button type='submit' onClick={handleSubmit}>Submit</button>
                    </div>
                </form>
            </div>
            {isLoading ? (
                <div className="loadingCircle">
                    <BeatLoader color="white" loading={isLoading} size={15}/>
                </div>
            ) : (
                Object.keys(results).length !== 0 && (
                    <div className="cards">
                        <div className="dropdownSorting">
                            <select value={sortingOption} onChange={(e) => setSortingOption(e.target.value)}>
                                <option value="priceL2H">Price (Low-High)</option>
                                <option value="priceH2L">Price (High-Low)</option>
                                <option value="totalTravelTimeL2H">Total Travel Time (Low-High)</option>
                                <option value="totalTravelTimeH2L">Total Travel Time (High-Low)</option>
                                <option value="depTimeL2H">Departure Time (Low-High)</option>
                                <option value="depTimeH2L">Departure Time (High-Low)</option>
                            </select>
                        </div>
                        {sortResults().map((entryValue, index) => (
                            <div className="card" key={index}>
                                <div className="cardInfo">
                                    <div className="depInfo">
                                        <div className="depAirline">
                                            <span><b>Departure Airline:</b> {entryValue.depAirline}</span>
                                        </div>
                                        <div className="depTimes">
                                            <span>{entryValue.depTimes[0]} - {entryValue.depTimes[1]}</span>
                                            <div className="stops">
                                                <h3>{entryValue.layoversTo.layoverCount === 'nonstop' ? 'Nonstop' : entryValue.layoversTo.layoverCount.slice(0, 1) === "1" ? `${entryValue.layoversTo.layoverCount.slice(0, 1)} Layover` : `${entryValue.layoversTo.layoverCount.slice(0, 1)} Layovers`}</h3>
                                                <div className="layover">
                                                {entryValue.layoversTo.layoverPorts.map((currPort, index) => (
                                                    <div className="layoverEntry">
                                                        <h5>{currPort}</h5>
                                                        {currPort.split('-').length > 1 && (
                                                            <p>Port Change Required</p>
                                                        )}                                                        
                                                        <span>{entryValue.layoversTo.layoverLengths[index]}</span>
                                                    </div>
                                                ))}
                                                </div>
                                            </div>
                                            <span><b>Departure Travel Time: {entryValue.depFlightLen}</b></span>
                                            <div className="date">
                                                <span>{MonthFirstDate(values.depDate)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="retInfo">
                                        <div className="retAirline">
                                            <span><b>Return Airline:</b> {entryValue.depAirline}</span>
                                        </div>
                                        <div className="retTimes">
                                            <span>{entryValue.retTimes[0]} - {entryValue.retTimes[1]}</span>
                                            <div className="stops">
                                                <h3>{entryValue.layoversFrom.layoverCount === 'nonstop' ? 'Nonstop' : entryValue.layoversFrom.layoverCount.slice(0, 1) === "1" ? `${entryValue.layoversFrom.layoverCount.slice(0, 1)} Layover` : `${entryValue.layoversFrom.layoverCount.slice(0, 1)} Layovers`}</h3>
                                                <div className="layover">
                                                {entryValue.layoversFrom.layoverPorts.map((currPort, index) => (
                                                    <div className="layoverEntry">
                                                        <h5>{currPort}</h5>
                                                        {currPort.split('-').length > 1 && (
                                                            <p>Port Change</p>
                                                        )}
                                                        <span>{entryValue.layoversFrom.layoverLengths[index]}</span>
                                                    </div>
                                                ))}
                                                </div>
                                            </div>                                           
                                            <span><b>Return Travel Time: {entryValue.retFlightLen}</b></span>
                                            <div className="date">
                                                <span>{MonthFirstDate(values.retDate)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="pricing">
                                    <h2>Price: {entryValue.price}</h2>
                                </div>
                                <div className="deals">
                                    <button onClick={() => handleLinkClick(entryValue.link)}>View Deal(s)</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    )
} 