import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Adjust the path as necessary for your AuthContext

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used inside an AuthContextProvider');
  }

  return context;
};
