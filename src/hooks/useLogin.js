import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthContext } from '../hooks/useAuthContext';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://ecoride1-backend.onrender.com/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const json = await response.json();
      console.log('Login Response:', json); // Debugging log

      if (!response.ok) {
        setIsLoading(false);
        setError(json.error);
      } else {
        if (json.email && json.token) { // Check if email and token are not null or undefined
          // Save the email and token to AsyncStorage
          await AsyncStorage.setItem('user', JSON.stringify({ email: json.email }));
          await AsyncStorage.setItem('token', json.token);

          // Update the auth context
          dispatch({ type: 'LOGIN', payload: { email: json.email } });

          // Update loading state
          setIsLoading(false);

          return json.token; // Return the token upon successful login
        } else {
          setIsLoading(false);
          setError('Invalid login response');
        }
      }
    } catch (error) {
      setIsLoading(false);
      setError('An error occurred while logging in.');
      console.error(error);
    }
  };

  return { login, isLoading, error };
};
