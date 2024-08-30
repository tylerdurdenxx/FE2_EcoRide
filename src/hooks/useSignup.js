import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthContext } from './useAuthContext';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (name, email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://ecoride1-backend.onrender.com/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const json = await response.json();
      console.log('Signup Response:', json);

      if (!response.ok) {
        setIsLoading(false);
        setError(json.message || 'An error occurred during signup');
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        // Store email in AsyncStorage for use in OTP verification
        await AsyncStorage.setItem('email', email);

        // Save the user's temporary data in AsyncStorage
        await AsyncStorage.setItem('tempUser', JSON.stringify(json));

        setIsLoading(false);
        return { success: true, email };
      }
    } catch (error) {
      setIsLoading(false);
      setError('An error occurred while signing up.');
      console.error(error);
      return { success: false };
    }
  };

  return { signup, isLoading, error };
};
