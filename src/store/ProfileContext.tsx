import React, { createContext, useContext, useState } from 'react';

type ProfileContextType = {
  photoUri: string | null;
  setPhotoUri: (uri: string | null) => void;
};

const ProfileContext = createContext<ProfileContextType>({
  photoUri: null,
  setPhotoUri: () => {},
});

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  return (
    <ProfileContext.Provider value={{ photoUri, setPhotoUri }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
