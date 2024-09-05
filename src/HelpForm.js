import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';

const HelpForm = () => {
  const handleEmail = () => {
    const email = 'syedanashussain111@gmail.com'; // Replace with your email address
    const subject = 'Help Request';
    const body = 'Please describe your issue or question here.';
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          console.error('Unsupported URL:', url);
        }
      })
      .catch((error) => {
        console.error('Error opening email client:', error);
      });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Payment Help & Support</Text>
      </View>

      <View style={styles.content}>
      <Text style={styles.headerText}>Need Assistance with Payments?</Text>
        <Text style={styles.bodyText}>
          If you need help with payment methods or have any issues related to payment, you can find more details email us.
        </Text>
        <Text style={styles.bodyText}>
          Click the Payment to navigate to our payment page where you can complete your transaction securely.
        </Text>
      </View>

      <TouchableOpacity style={styles.emailButton} onPress={handleEmail}>
        <Text style={styles.emailButtonText}>Send Us an Email</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { marginBottom: 20 },
  headerText: { fontSize: 24, fontWeight: 'bold' },
  content: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  sectionText: { fontSize: 16, marginBottom: 10 },
  emailButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  emailButtonText: { color: '#fff', fontSize: 16 },
});

export default HelpForm;
