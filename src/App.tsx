import React, {useState, useEffect, createContext} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {CookiesProvider} from 'react-cookie';
import {DateFormat} from './components/Utils/DateFormat';
import createInstance from './components/Utils/APICalls';
import './App.css';

import siteRoutes from './Routes';
import Navbar from './components/views/Navbar';
import IContextData from './components/Utils/Interfaces/ContextData';
import IUserData from './components/Utils/Interfaces/UserData';

export const ContextData = createContext<IContextData>({
  portDict: {},
  values: {
    depCity: '',
    depPort: '',
    depDate: DateFormat(new Date()),
    arrCity: '',
    arrPort: '',
    retDate: DateFormat(new Date()),
    noResultsBoolean: false,
    noResults: ''
  },
  setValues: () => {}
});

export const UserData = createContext<IUserData>({
  userStatus: {
    username: null,
    status: false 
  },
  setUserStatus: () => {},
});

export default function App() {

  const [values, setValues] = useState<IContextData['values']>({
    depCity: '',
    depPort: '',
    depDate: DateFormat(new Date()),
    arrCity: '',
    arrPort: '',
    retDate: DateFormat(new Date()),
    noResultsBoolean: false,
    noResults: ''
  });

  const airlineCodesAPI = createInstance('airlineCodes', null);
  const [portDict, setPortDict] = useState<IContextData['portDict']>({});
  const [userStatus, setUserStatus] = useState<IUserData['userStatus']>(() => {
    const storedUserStatus = localStorage.getItem('userStatus');
    return storedUserStatus ? JSON.parse(storedUserStatus) : { username: null, status: false };
  });

  useEffect(() => {
    const fetchDict = async() => {
      try {
        const res = await airlineCodesAPI.instance.get(airlineCodesAPI.url);
        if(res.data) {
          const newData: {[key: string]: string[]} = res.data
          setPortDict(newData);
        }
      } catch(err) {
        console.log(err)
      }
    }
    fetchDict();
  }, [])

  useEffect(() => {
    setValues(values);
    setPortDict(portDict);
  }, [values, portDict])

  useEffect(() => {
    // Store userStatus in Local Storage whenever it changes
    localStorage.setItem('userStatus', JSON.stringify(userStatus));
  }, [userStatus]);

  return (
    <CookiesProvider>
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
    </CookiesProvider>
  );
}
