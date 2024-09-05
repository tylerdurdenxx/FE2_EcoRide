import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';

const Wallet = ({ navigation, route }) => {
  const [walletData, setWalletData] = useState({ name: '', balance: 0 });
  const [loading, setLoading] = useState(true);
  const { token, email } = route.params;
console.log(token, 'wallet')


  const fetchWalletData = async () => {
    try {
      const response = await fetch('https://ecoride1-backend.onrender.com/api/home/wallet',  {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
      });
      const data = await response.json();
      setWalletData(data);
      setLoading(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to load wallet data.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const openPaymentLink = () => {
    const paymentUrl = 'https://buy.stripe.com/test_eVa2bf9NbeL415CdQQ';
    Linking.openURL(paymentUrl).catch(err => console.error('Failed to open URL:', err));
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Hi, {walletData.name}</Text>
        <Text style={styles.subHeaderText}>How're you today?</Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceText}>Balance</Text>
        <Text style={styles.balanceAmount}>Rs {walletData.balance}</Text>
        <TouchableOpacity style={styles.paymentButton} onPress={openPaymentLink}>
          <Text style={styles.buttonText}>Payment Methods</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        <TouchableOpacity style={styles.listItem}>
          <Text>Payment Methods</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('HelpForm')}>
          <Text>Help</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listItem} onPress={() => Linking.openURL('mailto:support@example.com')}>
          <Text>Contact Support</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { marginBottom: 20 },
  headerText: { fontSize: 24, fontWeight: 'bold' },
  subHeaderText: { fontSize: 16, color: '#888' },
  balanceCard: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 20,
  },
  balanceText: { fontSize: 16, color: '#888' },
  balanceAmount: { fontSize: 28, fontWeight: 'bold' },
  paymentButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: { color: '#fff', textAlign: 'center' },
  list: { marginTop: 20 },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default Wallet;
