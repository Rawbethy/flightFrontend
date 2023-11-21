import React from 'react';

export default interface IContextData {
    portDict: {[key: string]: string[]},
    values: {
      depCity: string,
      depPort: string | string[],
      depDate: string,
      arrCity: string,
      arrPort: string | string[],
      retDate: string,
      noResultsBoolean: boolean,
      noResults: string
    },
    setValues: React.Dispatch<React.SetStateAction<IContextData['values']>>;
  }