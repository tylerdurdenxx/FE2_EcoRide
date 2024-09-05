import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const Rewards = ({ route }) => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = route.params;

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        console.log('Fetching rewards data with token:', token);

        const response = await axios.get('https://ecoride1-backend.onrender.com/api/home/reward', {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        });
        setRewards(response.data);
        setLoading(false);
        console.log('rewards', response.data)
        const rewardIds = response.data.map(reward => reward.id);
        console.log('Reward IDs:', rewardIds);
      } catch (err) {
        setError('Failed to load rewards.');
        setLoading(false);
        console.error('Error:', err.response ? err.response.data : err.message);
      }
    };

    fetchRewards();
  }, [token]);

  
  const handleClaimReward = async (rewardId) => {
    try {
      setClaimingReward(rewardId); // Set claimingReward to the current rewardId to disable the button

      // Sending POST request to the API when claiming a reward
      const response = await axios.post(
        'https://ecoride1-backend.onrender.com/api/home/post',
        { rewardId }, // Send the rewardId in the body of the POST request
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
            'Content-Type': 'application/json', // Ensure the Content-Type is set correctly
          },
        }
      );

      console.log('Claim Reward Response:', response.data.message);

      // Display success toast with the response message
      Toast.show({
        type: 'success',
        text1: 'Reward Claimed',
        text2: response.data.message || 'You have successfully claimed the reward!',
      });

    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      // Display error toast with the error message
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to claim reward. Please try again.',
      });
    } finally {
      setClaimingReward(null); // Reset claimingReward after API call completes
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {rewards.map((reward) => (
        <View key={reward.id} style={styles.rewardCard}>
          <View style={styles.rewardDetails}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={require('../assets/prize.png')} style={styles.rewardImage} />
              <Text style={styles.rewardTitle}>{reward.name}</Text>
            </View>
            <Text>{reward.unlockCondition}</Text>
            <Text>{reward.benefits}</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.claimButton, 
              reward.isUnlocked ? styles.enabledClaimButton : styles.disabledClaimButton
            ]}
            onPress={() => handleClaimReward(reward.id)}
            disabled={!reward.isUnlocked}  // Disable if not unlocked
          >
            <Text style={[
              styles.claimButtonText, 
              reward.isUnlocked ? styles.enabledClaimButtonText : styles.disabledClaimButtonText
            ]}>
              {reward.isUnlocked ? 'Claim' : 'Claim'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
      <Toast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  rewardCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 20,
  },
  rewardDetails: {
    flex: 1,
  },
  rewardTitle: { fontSize: 16, fontWeight: 'bold', },
  rewardImage: { 
    marginRight: 5,
    width: 50,
    height: 50
  },
  claimButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  enabledClaimButton: {
    backgroundColor: '#CEFF00',
  },
  disabledClaimButton: {
    backgroundColor: '#d3d3d3',
  },
  claimButtonText: {
    fontWeight: 'bold',
  },
  enabledClaimButtonText: {
    color: '#28303C',
  },
  disabledClaimButtonText: {
    color: '#a9a9a9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
});

export default Rewards;
