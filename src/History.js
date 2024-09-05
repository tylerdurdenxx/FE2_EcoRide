import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';

const History = ({ route}) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, email } = route.params;

  console.log('history token passing and email', token, email)

  // Fetch the trip history data from the API
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch('https://ecoride1-backend.onrender.com/api/home/history', {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        });
        const data = await response.json();
        setTrips(data);
      } catch (error) {
        console.error('Error fetching trip history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {trips.length > 0 ? (
        trips.map((trip, index) => (
          <View key={index} style={styles.tripCard}>
          <View style={styles.detailContainer}>
        <Text style={styles.label}>Bike ID:</Text>
        <Text style={styles.value}>{trip.bikeId}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Start Point:</Text>
        <Text style={styles.value}>{trip.startPoint}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>End Point:</Text>
        <Text style={styles.value}>{trip.endPoint}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{new Date(trip.date).toLocaleString()}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Fare:</Text>
        <Text style={styles.value}>{trip.fare.toFixed(2)} PKR</Text>
      </View>
          </View>
        ))
      ) : (
        <Text>No trips found</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  tripCard: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 20,
  },
  tripTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },

});

export default History;
