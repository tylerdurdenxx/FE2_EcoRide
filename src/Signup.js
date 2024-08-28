import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import InputField from './InputField';
import { useSignup } from "./hooks/useSignup";
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const Signup = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const { signup, error, isLoading } = useSignup();

  const handleSignup = async () => {
    try {
      await signup(name, email, password);

      // Navigate to the 'Home' screen after successful signup
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Signup Error', error.message || 'Signup failed');
    }
  };

  const handleNavigateToLogin = () => {
    navigation.navigate('Login'); // Navigate to the 'Login' screen
  };

  return (
    <View style={{ flex: 1, flexDirection: 'column', alignContent: 'center' ,  }}>
        <View>
      <Image style={{ width: 410, height: 130 }} source={require('../assets/cover.jpeg')} />
      </View>
    <View >
    
      <View style={{ }}>
        <Text style={{ fontSize: 40, fontWeight: '800', color: '#28303C', left: 60 }}>
          Signup
        </Text>
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#BDBABA',  left: 60 }}>
          Please sign up to continue.
        </Text>
      </View>

      <View style={{ flexDirection: 'column', alignItems: 'center', }}>
        <InputField
          placeholder="Name"
          placeholderTextColor="#666666"
          secureTextEntry={false}
          leftImg={require('../assets/email.png')}
          keyboardType={'default'}
          onChangeText={setName}
          value={name}
        />
        <InputField
          placeholder="Email"
          placeholderTextColor="#666666"
          secureTextEntry={false}
          leftImg={require('../assets/email.png')}
          keyboardType={'email-address'}
          onChangeText={setEmail}
          value={email}
        />
        <InputField
          placeholder="Password"
          placeholderTextColor="#666666"
          isPassword={true}
          leftImg={require('../assets/pass.png')}
          onChangeText={setPassword}
          value={password}
        />
      </View>

      <View style={{ alignItems: 'center', top: 30}}>
        <TouchableOpacity
          style={{
            backgroundColor: '#28303C',
            height: 56,
            width: 299,
            justifyContent: 'center',
            borderRadius: 10,
          }}
          onPress={handleSignup}
          disabled={isLoading}
        >
          <Text style={{ color: 'white', alignSelf: 'center', fontWeight: '800', fontSize: 16 }}>
            Signup
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', top: 70 }}>
        <Text style={{ fontSize: 14, fontWeight: '500' }}>Already have an account?</Text>
        <TouchableOpacity onPress={handleNavigateToLogin}>
          <Text style={{ fontSize: 14, fontWeight: '800' }}> Login</Text>
        </TouchableOpacity>
        {error && <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text>}
      </View>
    </View>
    </View>
  );
};

export default Signup;