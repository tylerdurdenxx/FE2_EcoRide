import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ScrollView, StyleSheet, ActivityIndicator, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

const Profile = ({ route }) => {
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showShareForm, setShowShareForm] = useState(false);
  const [receiverEmail, setReceiverEmail] = useState('');
  const [pointsToShare, setPointsToShare] = useState(0);
  const [loading, setLoading] = useState(false);
  const { token } = route.params;

  useEffect(() => {
    if (token) {
      const fetchProfileData = async () => {
        try {
          const response = await axios.get('https://ecoride1-backend.onrender.com/api/home/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setProfile(response.data);
          setTransactions(response.data.wallet.transactions);
        } catch (error) {
          console.error('Failed to fetch profile data:', error.response ? error.response.data : error.message);
        }
      };

      fetchProfileData();
    }
  }, [token]);

  const handleSharePoints = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'https://ecoride1-backend.onrender.com/api/home/sharePoints',
        {
          receiverEmail,
          pointsToShare,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Alert.alert('Success', 'Points shared successfully!');
      console.log(response.data, 'new')
      setShowShareForm(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to share points.');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.header}>
          <Image source={require('../assets/image 12.png')} style={styles.avatar} />
          <View>
            <Text style={styles.name}>Hi, {profile.name}</Text>
            <Text style={styles.greeting}>How're you today?</Text>
          </View>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Image source={require('../assets/ride-time-icon.png')} style={styles.icon} />
            <Text style={styles.statLabel}>Total Ride Time</Text>
            <Text style={styles.statValue}>{profile.totalRideTime.toFixed(2)} min</Text>
          </View>
          <View style={styles.statItem}>
            <Image source={require('../assets/rideCount.png')} style={styles.icon} />
            <Text style={styles.statLabel}>Rides</Text>
            <Text style={styles.statValue}>{profile.totalRideCount}</Text>
          </View>
        </View>
        <View style={styles.loyaltyContainer}>
          <Image source={require('../assets/loyaltyS.png')} style={styles.icon1} />
          <Text style={styles.loyaltyText}>LOYALTY POINTS</Text>
          <Text style={styles.loyaltyPoints}>{profile.loyaltyPoints}</Text>
        </View>
        <View style={styles.loyaltyContainerPoints}>
          <TouchableOpacity onPress={() => setShowShareForm(!showShareForm)}>
            
            <Text style={styles.rideHistoryLink}>Share Loyalty Points</Text>
          </TouchableOpacity>
        </View>
        {showShareForm && (
          <View style={styles.shareForm}>
            <TextInput
              style={styles.input}
              placeholder="Receiver's Email"
              value={receiverEmail}
              onChangeText={setReceiverEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Points to Share"
              keyboardType="numeric"
              value={pointsToShare.toString()}
              onChangeText={(text) => setPointsToShare(Number(text))}
            />
            <TouchableOpacity style={styles.shareButton} onPress={handleSharePoints} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? 'Sharing...' : 'Share Points'}</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.accountSettings}>
          <View style={styles.settingRow}>
          <Image source={require('../assets/Account (1).png')} style={styles.iconEmail} />
            <Text style={styles.settingText}>{profile.name}</Text>
          </View>
          <View style={styles.settingRow}>
          <Image source={require('../assets/EmailNN.png')} style={styles.iconEmail} />
            <Text style={styles.settingText}>{profile.email}</Text>
          </View>
          <View style={styles.settingRow}>
          <Image source={require('../assets/Phone (2).png')} style={styles.iconEmail} />
            <Text style={styles.settingText}>{profile.phoneNumber}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.transactionHeader}>Most Recent Transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.transactionCard}>
            <Text style={styles.transactionAmount}>Amount: {item.amount}</Text>
            <Text>Type: {item.type}</Text>
            <Text>Description: {item.description}</Text>
            <Text>Date: {new Date(item.date).toLocaleDateString()}</Text>
          </View>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    marginRight: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  greeting: {
    fontSize: 16,
    color: '#777',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 40,
    
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  loyaltyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    // backgroundColor: '#f1f1f1',
    borderRadius: 10,
    padding: 10,
    borderWidth: 3, // Light border thickness
    borderColor: 'rgba(0, 0, 0, 0.1)', // Light black shade
  },
  loyaltyContainerPoints: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
  },
  loyaltyText: {
    left: -20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#777',
  },
  loyaltyPoints: {
    left: -30,
    fontSize: 25,
    fontWeight: 'bold',
    color: '#333',
  },
  accountSettings: {
    // backgroundColor: '#f1f1f1',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 2, // Light border thickness
    borderColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  settingText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 10,
  },
  rideHistoryLink: {
    fontSize: 14,
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  shareForm: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  shareButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  transactionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  icon1: {
    left:8,
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});

export default Profile;
