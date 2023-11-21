import axios from 'axios';

const baseURL = 'http://localhost:8080';
// const baseURL = 'https://flightapi.robert-duque.com:8080';

const createInstance = (url: string, token: string | null) => {
  const newURL = `${url !== '' ? `${baseURL}/${url}` : `${baseURL}`}`
  return {
    instance: 
      axios.create({
        baseURL: `${newURL}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}` 
        }
      }),
    url: newURL
  };
};

export default createInstance;