import React, {useState, useEffect, createContext, useContext, SetStateAction} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {DateFormat} from './components/Utils/DateFormat';
import axios from 'axios';
import './App.css';

import siteRoutes from './Routes';
import Navbar from './components/views/Navbar';

export interface IContextData {
  portDict: {[key: string]: string[]},
  values: {
    depCity: string,
    depPort: string | string[],
    depDate: string,
    arrCity: string,
    arrPort: string | string[],
    retDate: string
  },
  setValues: React.Dispatch<React.SetStateAction<IContextData['values']>>;
}

export interface IUserData {
  userStatus: {
    username: string | null,
    status: boolean
  },
  setUserStatus: React.Dispatch<React.SetStateAction<IUserData['userStatus']>>;
}

export const ContextData = createContext<IContextData>({
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
});

export const UserData = createContext<IUserData>({
  userStatus: {
    username: null,
    status: false 
  },
  setUserStatus: () => {}
});

export default function App() {

  const [values, setValues] = useState<IContextData['values']>({
    depCity: '',
    depPort: '',
    depDate: DateFormat(new Date()),
    arrCity: '',
    arrPort: '',
    retDate: DateFormat(new Date())
  });

  const [portDict, setPortDict] = useState<IContextData['portDict']>({});

  const [userStatus, setUserStatus] = useState<IUserData['userStatus']>({
    username: null,
    status: false
  });

  useEffect(() => {
    const fetchDict = async() => {
        axios.get('http://localhost:8080/airlineCodes').then(res => {
          const newData: {[key: string]: string[]} = res.data
          setPortDict(newData);
        }).catch(err => {
          console.log(err)
        })
    }
    fetchDict();
  }, [])

  useEffect(() => {
    setValues(values);
    setPortDict(portDict);
  }, [values, portDict])

  return (
    <UserData.Provider value={{userStatus, setUserStatus}}>
      <ContextData.Provider value={{values, portDict, setValues}}>
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