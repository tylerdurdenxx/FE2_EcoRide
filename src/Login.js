import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import InputField from './InputField';
import { useLogin } from './hooks/useLogin';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useLogin();

  const handleLogin = async () => {
    try {
      const token = await login(email, password);

      if (token) {
        console.log('Token received:', token); // Debugging log to ensure token is received
        navigation.navigate('Home', { token }); // Pass the token as a parameter
      } else {
        Alert.alert('Login Error', error || 'Login failed');
      }
    } catch (error) {
      Alert.alert('Login Error', error.message || 'Login failed');s
    }
  };

  return (
    <View style={{ flex: 1, flexDirection: 'column', alignContent: 'center' }}>
      <View>
        {/* <Image style={{ width: 410, height: 250 }} source={require('../assets/cover.jpeg')} /> */}
      </View>
      <View>
        <Text style={{ fontSize: 40, fontWeight: 'bold', color: '#28303C', marginTop: 100, marginLeft: 60 }}>Login</Text>
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#BDBABA', marginLeft: 60 }}>Please sign in to continue.</Text>
      </View>

      <View style={{ marginTop: 20, alignItems: 'center', }}>
        <InputField
          placeholder="Email"
          placeholderTextColor="#666666"
          secureTextEntry={false}
          leftImg={require('../assets/email.jpeg')}
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
        />
        <InputField
          placeholder="Password"
          placeholderTextColor="#666666"
          secureTextEntry={true}
          leftImg={require('../assets/pass.jpeg')}
          onChangeText={setPassword}
          value={password}
        />
      </View>

      <View style={{ alignItems: 'center', marginTop: 30 }}>
        <TouchableOpacity onPress={handleLogin} style={{
          backgroundColor: '#28303C', height: 56, width: 299,
          justifyContent: 'center', borderRadius: 10
        }}>
          <Text style={{ color: 'white', alignSelf: 'center', fontWeight: 'bold', fontSize: 16 }}>{isLoading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', top: 20 }}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', }}>Don’t have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black', marginLeft: 5 }}>Sign-up</Text>
        </TouchableOpacity>
      </View>

      {error && <Text style={{ color: 'red', alignSelf: 'center', marginTop: 20 }}>{error}</Text>}
    </View>
  );
};

export default Login;