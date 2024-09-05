import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const PaymentFormScreen = ({ navigation }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [amount, setAmount] = useState('');


  const handlePayment = () => {
    // Here you would typically make an API call to your payment gateway
    // For now, we'll just show a success message and navigate to the confirmation screen
    Alert.alert('Payment Success', 'Your payment was successful!');
    navigation.navigate('PaymentConfirmation', { cardNumber, expiryDate, amount });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Payment Form</Text>
      <TextInput
        style={styles.input}
        placeholder="Card Number"
        value={cardNumber}
        onChangeText={setCardNumber}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Expiry Date (MM/YY)"
        value={expiryDate}
        onChangeText={setExpiryDate}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="CVV"
        value={cvv}
        onChangeText={setCvv}
        keyboardType="numeric"
        secureTextEntry
      />
       <TextInput
        style={styles.input}
        placeholder="Card Number"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <Button title="Recharge Now" onPress={handlePayment} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default PaymentFormScreen;
