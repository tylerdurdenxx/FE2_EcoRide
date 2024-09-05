import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Linking, ScrollView } from 'react-native';

const HamburgerMenu = ({ navigation, route }) => {
  const { token, email } = route.params;

  const handleContactPress = () => {
    const phoneNumber = 'tel:+923171150996'; // Replace with your contact number
    Linking.openURL(phoneNumber).catch((err) => console.error('Failed to make a call', err));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Profile', { token, email })}
        >
          <Image source={require('../assets/profile.png')} style={styles.icon} />
          <Text style={styles.menuText}>Your Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('History', { token, email })}
        >
          <Image source={require('../assets/history.png')} style={styles.icon} />
          <Text style={styles.menuText}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Wallet',  { token, email })}
        >
          <Image source={require('../assets/wallet.png')} style={styles.icon} />
          <Text style={styles.menuText}>Wallet</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Rewards', { token, email })}
        >
          <Image source={require('../assets/prize.png')} style={styles.icon} />
          <Text style={styles.menuText}>Rewards</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity style={styles.contactButton} onPress={handleContactPress}>
        <Text style={styles.contactButtonText}>Contact Us</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F6',
  },
  menuContainer: {
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    width: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 15,
  },
  menuText: {
    fontSize: 18,
    color: '#28303C',
    fontWeight: '500',
  },
  contactButton: {
    backgroundColor: '#CEFF00',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    alignSelf: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  contactButtonText: {
    fontSize: 18,
    color: '#1F2734',
    fontWeight: 'bold',
  },
});

export default HamburgerMenu;
