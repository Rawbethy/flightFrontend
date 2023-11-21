import React from 'react';

export default interface IUserData {
    userStatus: {
      username: string | null,
      status: boolean
    },
    setUserStatus: React.Dispatch<React.SetStateAction<IUserData['userStatus']>>;
  }