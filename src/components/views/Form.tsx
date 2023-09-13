import React, {useState, useEffect, useContext, FormEvent} from 'react';
import { BeatLoader } from 'react-spinners';
import AutofillInput from '../Utils/autofill';
import {ContextData, UserData} from '../../App'
import {DateFormat, AddDays, MonthFirstDate} from '../Utils/DateFormat';
import axios from 'axios';

import '../styles/form.css'

interface CardInfo {
    ports: {
        depTO: string[],
        depL: string[],
        retTO: string[],
        retL: string[]
    }
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
    resultID: string,
    price: string
}

const commonFormStyles: React.CSSProperties = {
    position: 'relative',
    height: '20vh',
    minHeight: '300px',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '30px',
    marginBottom: '30px',
    borderStyle: 'solid',
    borderColor: 'rgba(245, 245, 245, 0.648)',
    borderWidth: '4px'
}

const formStyles: React.CSSProperties = window.innerWidth < 768 ? {
    ...commonFormStyles,
    padding: '10px',
    width: '85%',
    minWidth: '300px'
} : {
    ...commonFormStyles,
    padding: '40px',
    width: '50%',
    minWidth: '350px',
    maxWidth: '700px'
}

export default function Form() {

    const {values, setValues} = useContext(ContextData);
    const {userStatus, setUserStatus} = useContext(UserData);

    const parseTime = (timeString: string) => {
        const [time, ampm] = timeString.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        const isPM = ampm.toLowerCase() === 'pm';

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

    const [errors, setErrors] = useState({
        depCity: '',
        arrCity: '',
        dates: '',
    });

    const [results, setResults] = useState<Record<string, CardInfo>>({});
    const [noResults, setNoResults] = useState({
        res: true,
        resMessage: ''
    })
    const [sortingOption, setSortingOption] = useState("priceL2H");
    const [isLoading, setIsLoading] = useState(false);

    const handleErrors = (depDate: string, retDate: string, depCity: string, arrCity: string) => {
        let newErrors = {
            depCity: '',
            arrCity: '',
            dates: ''
        };

        if(depDate > retDate) {
            newErrors = {
                ...newErrors,
                dates: 'Return date needs to be after departure date',
            };
        }

        if(depCity === '') {
            newErrors = {
                ...newErrors,
                depCity: 'Departure city not specified!',
            };
        }

        if(arrCity === '') {
            newErrors = {
                ...newErrors,
                arrCity: 'Arrival city not specified!',
            };
        }

        // setErrors((prevErrors) => ({
        //     ...prevErrors,
        //     ...newErrors
        // }));
        return newErrors;
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
        const errors = handleErrors(values.depDate, values.retDate, values.depCity, values.arrCity);
        if(errors.depCity !== '' || errors.arrCity !== '' || errors.dates !== '') {
            setErrors((prevErrors) => ({
                ...prevErrors,
                ...errors
            }))
           return;
        }
        else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                ...errors
            }))
            try {
                setIsLoading(true);
                if(userStatus.status) {
                    // const res = await axios.post('http://localhost:8080/airlineAPI', {
                    const res = await axios.post('https://flightapi.robert-duque.com:8080/airlineAPI', {
                        depPort: values.depPort,
                        depCity: values.depCity,
                        arrPort: values.arrPort,
                        arrCity: values.arrCity,
                        depDate: values.depDate,
                        retDate: values.retDate,
                        username: userStatus.username
                    });
                    if(res.data.message) {
                        setNoResults((prevRes) => ({
                            ...prevRes,
                            res: false,
                            resMessage: res.data.message
                        }))
                    }
                    else {
                        setResults(res.data);        
                    }
                }
                else {
                    // const res = await axios.post('http://localhost:8080/airlineAPI', {
                    const res = await axios.post('https://flightapi.robert-duque.com:8080/airlineAPI', {
                        depPort: values.depPort,
                        arrPort: values.arrPort,
                        depCity: values.depCity,
                        arrCity: values.arrCity,
                        depDate: values.depDate,
                        retDate: values.retDate
                    });
                    if(res.data.message) {
                        setNoResults((prevRes) => ({
                            ...prevRes,
                            res: false,
                            resMessage: res.data.message
                        }))
                    }
                    else {
                        setResults(res.data);     
                    }
                }
            } catch (error) {
                alert(error);
            } finally {
                setIsLoading(false);
            }
        }
    }

    useEffect(() => {
        setValues(values);
        setResults(results);
        setNoResults(noResults);
    }, [values, results, noResults]);

    const currDate = DateFormat(new Date());
    
    return (
        <div className="main">
            <div className="form-container">
                <form autoComplete='off' style={formStyles}>
                    <div className="cities">
                        <div className='cityInput'>
                            <label htmlFor="">Departure City</label>
                            <AutofillInput dest='depCity'/>
                            <div className="errorMsg">
                                {errors.depCity && <span style={{position: 'relative', color: 'red', fontSize: '14px', padding: '10px 0'}}>{errors.depCity}</span>}
                            </div>
                        </div>
                        <div className='cityInput'>
                            <label htmlFor="">Arrival City</label>
                            <AutofillInput dest='arrCity'/>
                            <div className="errorMsg">
                                {errors.arrCity && <span style={{position: 'relative', color: 'red', fontSize: '14px', padding: '10px 0'}}>{errors.arrCity}</span>}
                            </div>
                        </div>
                    </div>
                    <br />
                    <div className='dates'>
                        <div className='depDate'>
                            <label htmlFor="">Departure Date</label>
                            <div className='dateInput'>
                                <input value={values.depDate} type="date" name='depDate' min={currDate} onChange={handleDateUpdate}/>
                            </div>                       
                        </div>
                        <div className='retDate'>
                            <label htmlFor="">Return Date</label>
                            <div className='dateInput'>
                                <input value={values.retDate} type="date" name='retDate' min={currDate} onChange={handleDateUpdate}/>
                            </div>
                        </div>
                    </div>
                    <div className="errorMsg">
                        {errors.dates && <span style={{position: 'relative', color: 'red', fontSize: '14px', padding: '10px 0'}}>{errors.dates}</span> }
                    </div>
                    <button className='submitButton' type='submit' onClick={handleSubmit}>Submit</button>
                </form>
            </div>
            {isLoading ? (
                <div className="loadingCircle">
                    <BeatLoader color="white" loading={isLoading} size={15}/>
                </div>
            ) : !noResults.res ? (
                <div className="noResults">
                    <h1 style={{color: 'white'}}>No results from search, please try again!</h1>
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
                                        <div className="genInfo">
                                            <h2>From {entryValue.ports['depTO'][0]}</h2>
                                            {window.innerWidth > 768 && (
                                                <h4>({entryValue.ports['depTO'][1]})</h4>
                                            )}
                                            <div className="date">
                                                <span>{MonthFirstDate(values.depDate)}</span>
                                            </div>
                                            <span>{entryValue.depTimes[0]} - {entryValue.depTimes[1]}</span>
                                        </div>
                                        <div className="depAirline">
                                            <span><b>Departure Airline:</b> {entryValue.depAirline}</span>
                                        </div>
                                        <div className="depTimes">
                                            <div className="travelTime">
                                                <span><b>Departure Travel Time:</b> {entryValue.depFlightLen}</span>
                                            </div>
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
                                            <h2>To {entryValue.ports['depL'][0]}</h2>
                                            {window.innerWidth > 768 && (
                                                <h4>({entryValue.ports['depL'][1]})</h4>
                                            )}
                                        </div>
                                    </div>
                                    <div className="retInfo">
                                        <div className="genInfo">
                                            <h2>From {entryValue.ports['retTO'][0]}</h2>
                                            {window.innerWidth > 768 && (
                                                <h4>({entryValue.ports['retTO'][1]})</h4>
                                            )}
                                            <div className="date">
                                                <span>{MonthFirstDate(values.retDate)}</span>
                                            </div>
                                            <span>{entryValue.retTimes[0]} - {entryValue.retTimes[1]}</span>
                                        </div>
                                        <div className="retAirline">
                                            <span><b>Return Airline:</b> {entryValue.depAirline}</span>
                                        </div>
                                        <div className="retTimes">
                                            <div className="travelTime">
                                                <span><b>Return Travel Time:</b> {entryValue.retFlightLen}</span>
                                            </div>
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
                                            <h2>To {entryValue.ports['retL'][0]}</h2>
                                            {window.innerWidth > 768 && (
                                                <h4>({entryValue.ports['retL'][1]})</h4>
                                            )}
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
