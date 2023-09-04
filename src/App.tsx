import React, {useState, useEffect, createContext} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {DateFormat} from './components/Utils/DateFormat';
import axios from 'axios';
import './App.css';

import siteRoutes from './Routes';
import Navbar from './components/views/Navbar';

interface contextData {
  portDict: {[key: string]: string[]},
  values: {
    depCity: String,
    depPort: string | string[],
    depDate: string,
    arrCity: String,
    arrPort: string | string[],
    retDate: string
  },
  setValues: React.Dispatch<React.SetStateAction<contextData['values']>>;
}


export const ContextData = createContext<contextData>({
  portDict: {},
  values: {
    depCity: '',
    depPort: '',
    depDate: DateFormat(new Date()),
    arrCity: '',
    arrPort: '',
    retDate: DateFormat(new Date())
  },
  setValues:() => {}
})


export default function App() {

  const [portDict, setDict] = useState<{ [key: string]: string[] }>({});
  const [values, setValues] = useState<contextData['values']>({
    depCity: '',
    depPort: '',
    depDate: DateFormat(new Date()),
    arrCity: '',
    arrPort: '',
    retDate: DateFormat(new Date())
  })

  useEffect(() => {
    const fetchDict = async() => {
        axios.get('http://ec2-18-188-4-231.us-east-2.compute.amazonaws.com:8080/airlineCodes').then(res => {
            setDict(res.data);
        }).catch(err => {
            console.log(err)
        })
    }
    fetchDict();
  }, [])

  useEffect(() => {
    setDict(portDict);
    setValues(values);
  }, [portDict, values])

  return (

    <ContextData.Provider value={{portDict, values, setValues}}>
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
  );
}