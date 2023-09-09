import React, {useEffect, useState, useContext, useRef} from 'react';
import {ContextData} from '../../App'
import '../styles/form.css'

const AutofillInput = ({dest}: {dest: string}) => {

    const [inputValue, setInputValue] = useState('');
    const [citiesList, setCitiesList] = useState<string[]>([])
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedAirport, setSelectedAirport] = useState<string | string[] | null>(null);
    const [hoverOptionIndex, setHoverOptionIndex] = useState<number>(-1);
    const [currListLen, setCurrListLen] = useState<number>(-1);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    
    const {setValues, portDict} = useContext(ContextData);

    const getCurrListLen = (list: string[]) => {
        var len = 0;
        list.forEach((city) => {
            len += 1;
            portDict[city].forEach(() => {
                len += 1
            })
        })
        return len;
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputText = event.target.value;
        setInputValue(inputText);
        setHoverOptionIndex(-1);
        var cities: string[] = []
        if(inputText === '') {
            setCurrListLen(-1);
            return;
        }
        // Check if the input matches any regex pattern in the dictionary

        try {
            const regex = new RegExp('^' + inputText, 'i');
            for (const pattern in portDict) {
                if (regex.test(pattern)) {
                    cities.push(pattern);
                }
            }
            setCitiesList(cities);
            setDropdownVisible(cities.length > 0);
            setCurrListLen(getCurrListLen(cities));
        } catch (err) {
            console.log('Error: ', err)
        }

    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if(event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'Enter') {
            event.preventDefault();

            const increment = event.key === 'ArrowDown' ? 1 : -1;
            const newIndex = hoverOptionIndex + increment;
            if(newIndex < 0) {
                setHoverOptionIndex(-1);
            }
            else if(newIndex > currListLen) {
                setHoverOptionIndex(currListLen);
            }
            else {
                setHoverOptionIndex(newIndex);
            }

            if(event.key === 'Enter') {
                event.preventDefault();
                var currOpt = -1;
                var set = false;
                citiesList.forEach((city) => {
                    currOpt += 1;
                    portDict[city].forEach((port) => {
                        currOpt += 1;
                        if(currOpt === hoverOptionIndex) {
                            set = true;
                            handleDropdownSelection(city, port);
                        }
                    })
                })
                if(!set) {
                    handleCitySelection(citiesList[hoverOptionIndex]);
                }
            }
        }
    }

    const handleDropdownSelection = (city: string, port: string) => {
        var lowerCity = city.toLowerCase();
        if(dest === 'depCity') {
            setValues((prevValues) => ({
                ...prevValues,
                depCity: city,
                depPort: port[0]
            }))
        }
        else if(dest === 'arrCity') {
            setValues((prevValues) => ({
                ...prevValues,
                arrCity: city,
                arrPort: port[0]
            }))
        }
        setSelectedAirport(port[0]);
        setInputValue(`${lowerCity.replace(/\b\w/g, (char, index) => char.toUpperCase())} (${port[0]})`);
        setDropdownVisible(false);
    }

    const handleCitySelection = (city: string) => {
        var ports: string[] = [];
        var lowerCity = city.toLowerCase();
        var inputString : string = `${lowerCity.replace(/\b\w/g, (char, index) => char.toUpperCase())} `;
        portDict[city].forEach(port => {
            ports.push(port[0]);
            inputString += `(${port[0]}) `;
        })
        if(dest === 'depCity') {
            setValues((prevValues) => ({
                ...prevValues,
                depCity: city,
                depPort: ports
            }))
        }
        else if(dest === 'arrCity') {
            setValues((prevValues) => ({
                ...prevValues,
                arrCity: city,
                arrPort: ports
            }))
        }
        setSelectedAirport(ports);
        setDropdownVisible(false);
        setInputValue(inputString);
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setDropdownVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setInputValue(inputValue);
        setCitiesList(citiesList);
        setHoverOptionIndex(hoverOptionIndex);
        setCurrListLen(currListLen);
    }, [inputValue, citiesList, hoverOptionIndex, currListLen])


    return (
        <div className="input-dropdown">
            <input
            className="inputText"
            type="text"
            value={inputValue !== selectedAirport ? inputValue : selectedAirport}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type something..."
            />
            {dropdownVisible && inputValue !== "" && (
                <div ref={dropdownRef} className="dropdown">
                    {citiesList.map((city, cityIndex) => {
                        if (portDict[city]) {
                            const totalPreviousAirports = citiesList.slice(0, cityIndex).reduce((total, prevCity) => total + (portDict[prevCity] ? portDict[prevCity].length : 0), 0);
                            return (
                                <div key={cityIndex} className="dropdownOption">
                                    <button className={`cityButton ${Math.round(totalPreviousAirports + cityIndex) === hoverOptionIndex ? 'hovered' : ''}`} onClick={() => handleCitySelection(city)}>
                                        {city}
                                    </button>
                                    {portDict[city].map((port, portIndex) => (
                                        <button className={`portButton ${(totalPreviousAirports + cityIndex + portIndex + 1) === hoverOptionIndex ? 'hovered': ''}`} onClick={() => handleDropdownSelection(city, port)}>
                                            {port[1]} ({port[0]})
                                        </button>
                                    ))}
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            )}
        </div>
    );
};

export default AutofillInput;