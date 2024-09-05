import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PaymentConfirmationScreen = ({ route }) => {
  const { cardNumber, expiryDate, amount } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Payment Confirmation</Text>
      <Text style={styles.text}>Thank you for your payment!</Text>
      <Text style={styles.text}>Card Number: {cardNumber}</Text>
      <Text style={styles.text}>Expiry Date: {expiryDate}</Text>
      <Text style={styles.text}>Amount Received {amount}</Text>

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
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default PaymentConfirmationScreen;
