import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Image, Alert, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Location from 'expo-location';
import axios from 'axios';
import { Stopwatch } from 'react-native-stopwatch-timer';
import Toast from 'react-native-toast-message';

// Function to shorten bikeId
// const shortenBikeId = (id) => {
//   return id.charAt(0).toUpperCase(); // Example: using the first character of the bikeId
// };

const Home = ({ route }) => {
  const [rideState, setRideState] = useState('scan');
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [dockId, setDockId] = useState('');
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [returnDockId, setReturnDockId] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);
  const { token } = route.params;

  // Timer states
  const [rideTimerStart, setRideTimerStart] = useState(true);
  const [rideTimerReset, setRideTimerReset] = useState(false);
  const [totalTimerStart, setTotalTimerStart] = useState(false);
  const [totalTimerReset, setTotalTimerReset] = useState(false);

  const [rideDetails, setRideDetails] = useState({ bikeId: '', stationName: '' });

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      setLoading(false);
    };

    getLocation();
  }, []);

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getPermissions();
  }, []);
  useEffect(() => {
    let interval;
    // Start the timer when the rideState changes to 'scanReturnDock' (SCAN TO LOCK)
    if (rideState === 'scanReturnDock' && !isTimerRunning) {
      setIsTimerRunning(true);
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000); // Increment timer every second
    }

    // Cleanup: stop the timer when the component unmounts or the ride ends
    return () => {
      clearInterval(interval);
      setIsTimerRunning(false);
    };
  }, [rideState]);
  const handleScanClick = () => {
    if (hasPermission === null) {
      Alert.alert('Checking Permission', 'Checking for camera permission...');
      return;
    }

    if (hasPermission) {
      setRideState('scanQRCode');
    } 
    if (rideState === 'scanReturnDock') {
      // Stop the timer when 'SCAN TO LOCK' is clicked
      setIsTimerRunning(false);
      // setRideState('scan'); 
      setTimer(0); // Reset the timer
    }
    
    else {
      Alert.alert('Permission Required', 'Camera permission is needed to scan QR codes.');
    }
  };

  const handleBarcodeScanned = async ({ data }) => {
    setScanned(true);

    try {
      const requestUrl = `https://ecoride1-backend.onrender.com/api/home/dock/${data}`;
      const response = await axios.get(requestUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { dockId, status, bikeId, stationName } = response.data;
      setDockId(dockId);

      // Shorten bikeId and update rideDetails
      // const shortenedBikeId = shortenBikeId(bikeId);
      setRideDetails({ bikeId, stationName });

      if (status === 'occupied') {
        setRideState('startRide');
      } else if (status === 'empty') {
        setRideState('endRide');
        setReturnDockId(dockId);
      } else {
        Alert.alert('Error', 'Dock status is unknown.');
        setRideState('scan');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'TRY ANOTHER DOCK',
        text2: error.response ? error.response.data : error.message,
        position: 'center',
        visibilityTime: 5000,
      });
      if (error.response && error.response.status === 404) {
        Alert.alert('Error', 'Dock not found. Please try again.');
      }
      setRideState('scan');
    } finally {
      setScanned(false);
    }
  };
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleStartRideClick = async () => {
    if (!dockId) {
      Alert.alert('Error', 'No dock selected.');
      return;
    }

    try {
      const response = await axios.post(
        'https://ecoride1-backend.onrender.com/api/home/ride/start',
        { dockId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Start ride response:', response.data);  // Check if bikeId is present here
      Toast.show({
        type: 'info',
        text1: 'RIDE IN PROGRESS',
        text2: 'YOUR TIMER STARTED',
        position: 'center',
        visibilityTime: 5000,
      });
      setRideTimerReset(true);
      setRideTimerStart(true);
      setTotalTimerStart(true);
      setRideState('scanReturnDock');
    } catch (error) {
      console.error('Error starting ride:', error);
      Alert.alert('Error', 'Failed to start the ride.');
    }
  };

  const handleEndRideClick = async () => {
    if (!returnDockId) {
      Alert.alert('Error', 'No dock selected for returning the bike.');
      return;
    }
  
    try {
      const response = await axios.post(
        'https://ecoride1-backend.onrender.com/api/home/ride/end',
        { dockId: returnDockId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    
      console.log('End ride response:', response.data);  // Check if bikeId is present here
      setRideTimerStart(false);
      setRideTimerReset(true);
      setTotalTimerStart(false);
      setTotalTimerReset(true);
      setRideState('scan');
      setReturnDockId(null);
    } catch (error) {
      console.error('Error ending ride:', error);
      Alert.alert('Error', 'Failed to end the ride.');
    }
  };
  const bikeLocations = [
    { id: 'bike1', latitude: location ? location.latitude + 0.001 : 24.916668, longitude: location ? location.longitude + 0.001 : 67.090528 },
    { id: 'bike2', latitude: location ? location.latitude + 0.002 : 24.917668, longitude: location ? location.longitude + 0.002 : 67.091528 }
  ];

  return (
    <View style={styles.container}>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="black" />
          <Text style={styles.loadingText}>Loading map...</Text>
        </View>
      )}

      {!loading && (
        <>
          {rideState === 'scanQRCode' && hasPermission !== null && (
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarcodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
          )}

          {rideState !== 'scanQRCode' && (
         <MapView
         ref={mapRef}
         style={styles.map}
         initialRegion={{
           latitude: location ? location.latitude : 24.915668,
           longitude: location ? location.longitude : 67.089528,
           latitudeDelta: 0.005, // Decreased for more zoom
           longitudeDelta: 0.005, // Decreased for more zoom
         }}
         showsUserLocation={true}
         showsMyLocationButton={true}
         onMapReady={() => setLoading(false)}
       >
              {location && (
                <Marker
                  coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                >
                  <Image
                    source={require('../assets/human.png')}
                    style={styles.customIcon}
                  />
                </Marker>
              )}

              {bikeLocations.map(bike => (
                <Marker
                  key={bike.id}
                  coordinate={{ latitude: bike.latitude, longitude: bike.longitude }}
                  title={`Bike ${bike.id}`}
                >
                  <Image
                    source={require('../assets/mark.png')}
                    style={styles.bikeIcon}
                  />
                </Marker>
              ))}
            </MapView>
          )}
                <Toast />

          <View style={styles.buttonContainer}>

          {/* { {rideState === 'scanReturnDock' (
            

      )} } */}

<Text style={styles.timerText}>
  {rideState === 'scan' ? '' : `RIDE IN PROGRESS... ${formatTime(timer)}`}
</Text>


            {(rideState === 'scan' || rideState === 'scanReturnDock') && (
              
              <TouchableOpacity
                style={styles.scanButton}
                onPress={handleScanClick}
              >
                <Image
                  source={require('../assets/scann.png')} // Adjust path to your image
                  style={styles.buttonImage}
                />
                <Text style={styles.buttonText}>
                  {rideState === 'scan' ? 'SCAN TO UNLOCK' : 'SCAN TO LOCK'}
                </Text>
             
              </TouchableOpacity>
            )}


          </View>

          {(rideState === 'startRide' || rideState === 'endRide') && (
       <View style={styles.actionButtonContainer}>
       <TouchableOpacity
         style={styles.actionButton}
         onPress={rideState === 'startRide' ? handleStartRideClick : handleEndRideClick}
       >
         <Text style={styles.actionButtonText}>
           {rideState === 'startRide' ? 'START RIDE' : 'END RIDE'}
         </Text>
       </TouchableOpacity>
     </View>
     
          )}

          {(rideState === 'startRide' || rideState === 'endRide') && (

        <View style={styles.rideDetailsContainer}>
          
          <View style={styles.stationWrapper}>

          <Text style={{ fontSize: 20, fontWeight: 'bold', top: -30,}}>CONFIRM YOUR RIDE</Text>
          <View style={{ height: 2, // Thickness of the underline
    width: 192, // Width of the underline (adjust as needed)
    backgroundColor: 'black', // Color of the underline
    opacity: 0.5, // Less opacity for the underline
    marginTop: 0,
    top: -30,}} />

          <View style={styles.stationContainer1}>
          <Image style={{ right: 10}}  source={require('../assets/qr.png')} />
          <Text style={styles.rideDetailsText}>Scanned from: <Text style={styles.rideDetailsText1}> {rideDetails.stationName}</Text></Text>
        </View>

        <View style={styles.stationContainer1}>
          <Image style={{ right: 10, width: 20}} source={require('../assets/station.jpeg')} />
          <Text style={styles.rideDetailsText}>Lock at the next Station</Text>
        </View>
          </View>
  


        <View style={styles.bikeContainer}>
          <Image source={require('../assets/bike-home.jpeg')} style={styles.bikeImage} />
          <Text style={styles.rideDetailsText}>Bike ID: {rideDetails.bikeId}</Text>
        </View>
      </View>  
      // </View>
       
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  timerText: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  stationWrapper: {
    flexDirection: 'column', // Stack items vertically
    justifyContent: 'center', // Center items vertically
    paddingHorizontal: 10, // Optional: add horizontal padding if needed
    paddingVertical: 40, // Reduce vertical padding to decrease gap,
    top: 10
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  map: {
    flex: 1,
  },
  customIcon: {
    width: 40,
    height: 40,
  },
  bikeIcon: {
    width: 40,
    height: 70,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    flexDirection: 'column',
  },
  scanButton: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#28303C',
    borderRadius: 10,
    width: 250,
    height: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonImage: {
    width: 30,
    height: 30,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  actionButtonContainer: {
    position: 'absolute',
    bottom: 20, // Same position for both buttons
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'white',
    height: 200,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    borderWidth: 0.2,
    borderBottomWidth: 0
  },
  
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#28303C', // Same background color
    borderRadius: 5,
    width: 200, // Consistent width
    height: 40, // Consistent height
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButtonText: {
    fontSize: 24, 
    fontWeight: 'bold',
    color: '#fff',
  },
  rideDetailsContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20,
    paddingVertical: 10,
    bottom: 40
  },
  stationContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  stationContainer1: {
    alignItems: 'center',
       flexDirection: 'row',

  },
  bikeContainer: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 

  },
  bikeImage: {
    width: 60,
    height: 60,
    top: 10
  },
  rideDetailsText: {
    fontSize: 14,
    color: 'grey',
    textAlign: 'center', // Center the text
    padding: 5
  },
  rideDetailsText1: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold', // or use 'normal' for regular weight
    
  }
});

export default Home;
