import React, { createContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the AuthContext
export const AuthContext = createContext();

// Define a reducer to handle actions
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload };
    case 'LOGOUT':
      return { user: null };
    default:
      return state;
  }
};

// Create a provider component
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          dispatch({ type: 'LOGIN', payload: JSON.parse(user) });
        }
      } catch (error) {
        console.error('Failed to load user', error);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    const saveUser = async () => {
      try {
        if (state.user) {
          await AsyncStorage.setItem('user', JSON.stringify(state.user));
        } else {
          await AsyncStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Failed to save user', error);
      }
    };

    saveUser();
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
