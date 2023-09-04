import React, {useState, useEffect, createContext} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {DateFormat} from './components/Utils/DateFormat';
import axios from 'axios';
import './App.css';

import siteRoutes from './Routes';
import Navbar from './components/views/Navbar';

interface ContextData {
  portDict: {[key: string]: string[]},
  values: {
    depCity: String,
    depPort: string | string[],
    depDate: string,
    arrCity: String,
    arrPort: string | string[],
    retDate: string
  },
  setValues: React.Dispatch<React.SetStateAction<ContextData['values']>>;
}

interface UserData {
  userStatus: {
    username: string | null,
    status: boolean
  },
  setUserStatus: React.Dispatch<React.SetStateAction<UserData['userStatus']>>;
}

export const ContextData = createContext<ContextData | undefined>(undefined);
export const UserData = createContext<UserData | undefined>(undefined);

export default function App() {

  const [flightValues, setFlightValues] = useState<ContextData>({
    portDict: {},
    values: {
      depCity: '',
      depPort: '',
      depDate: DateFormat(new Date()),
      arrCity: '',
      arrPort: '',
      retDate: DateFormat(new Date())
    },
    setValues: () => {}
  })

  const [userStatus, setUserStatus] = useState<UserData['userStatus']>({
    username: null,
    status: false
  })

  useEffect(() => {
    const fetchDict = async() => {
        axios.get('http://ec2-18-188-4-231.us-east-2.compute.amazonaws.com:8080/airlineCodes').then(res => {
            setFlightValues((prevState) => ({
              ...prevState,
              portDict: res.data
            }));
        }).catch(err => {
            console.log(err)
        })
    }
    fetchDict();
  }, [])

  useEffect(() => {
    setFlightValues(flightValues);
  }, [flightValues])

  return (
    <UserData.Provider value={{userStatus: userStatus, setUserStatus: setUserStatus}}>
      <ContextData.Provider value={{values: flightValues.values, portDict: flightValues.portDict, setValues: flightValues.setValues}}>
        <div className="App">
          <Router>
            <Navbar />
            <Routes>
              {siteRoutes.map((route, index) => (
                <Route key={index} path={route.path} Component={route.component}></Route>
              ))}
            </Routes>
          </Router>
        </div>
      </ContextData.Provider>
    </UserData.Provider>
  );
}