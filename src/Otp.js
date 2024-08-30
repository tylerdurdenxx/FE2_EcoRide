import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Otp = () => {
  const navigation = useNavigation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState(''); // State to hold the email
  const otpRefs = useRef([]);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('email');
        if (storedEmail) {
          setEmail(storedEmail);
        } else {
          Alert.alert('Error', 'Email not found. Please try signing up again.');
        }
      } catch (error) {
        console.error('Error fetching email from AsyncStorage:', error);
        Alert.alert('Error', 'Failed to retrieve email. Please try again.');
      }
    };

    fetchEmail();
  }, []);

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;

    if (value !== '' && index < 5) {
      otpRefs.current[index + 1].focus();
    }

    setOtp(newOtp);
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    setIsSubmitting(true);

    try {
      const response = await axios.post('https://ecoride1-backend.onrender.com/api/user/verify', {
        email,
        verificationCode: otpCode,
      });

      console.log('OTP Verification Response:', response.data);

      if (response.data.token) {
        const tempUser = await AsyncStorage.getItem('tempUser');
        const parsedUser = tempUser ? JSON.parse(tempUser) : null;

        if (parsedUser) {
          const finalUserData = { ...parsedUser, token: response.data.token };
          await AsyncStorage.setItem('user', JSON.stringify(finalUserData));

          // Navigate to the Home screen with the token
          navigation.navigate('Home', { token: response.data.token });
        } else {
          Alert.alert('Error', 'Temporary user data not found. Please try again.');
        }
      } else {
        Alert.alert('Verification Failed', 'Invalid OTP code. Please try again.');
      }
    } catch (error) {
      console.error('Verification Error:', error);
      Alert.alert('Verification Error', error.response?.data?.error || 'OTP verification failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>Enter the OTP sent to your email.</Text>
      </View>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (otpRefs.current[index] = ref)}
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(value) => handleChange(value, index)}
            returnKeyType="next"
            autoFocus={index === 0}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleVerifyOtp}
          style={[styles.verifyButton, isSubmitting && styles.disabledButton]}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? 'Verifying...' : 'Verify OTP'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn’t receive the code?</Text>
        <TouchableOpacity onPress={() => {/* Add resend OTP logic here */}}>
          <Text style={styles.resendButton}>Resend OTP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#28303C',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#BDBABA',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  otpInput: {
    width: 40,
    height: 56,
    borderWidth: 1,
    borderColor: '#BDBABA',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  verifyButton: {
    backgroundColor: '#28303C',
    height: 56,
    width: 299,
    justifyContent: 'center',
    borderRadius: 10,
  },
  disabledButton: {
    backgroundColor: '#A9A9A9',
  },
  buttonText: {
    color: 'white',
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    top: 20,
  },
  resendText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  resendButton: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 5,
  },
});

export default Otp;
