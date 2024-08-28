import { StyleSheet, Text, View, Image, Touchable, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

import Icon from 'react-native-vector-icons/FontAwesome'


const Start = ({ navigation }) => {

 
    return (
        <View>
            <View style={{ position: 'relative' }}>


                {/* <Image resizeMode='contain' style={{ height: '100%', width: '100', }} source={require('../assets/map.jpeg')} /> */}
            </View>


            <View style={{ position: 'absolute', 
            alignSelf: 'center', bottom: '0%', 
            backgroundColor: 'white', width: '100%', height: '35%', borderTopLeftRadius: 25 , justifyContent: 'space-evenly', }}>

<View>


{/* <Image style={{ alignSelf: 'center',}}source={require('../assets/lineb.png')} /> */}
<Icon
        name="arrow-back" // Name of the icon (back arrow)
        size={30} // Size of the icon
        color="black" // Color of the icon
      />
                <Text style={{ alignSelf: 'center' ,
            fontWeight: 700,
            fontSize: 20,
            top: '40%'
            }}>
                
                CONFIRM YOUR RIDE
                
                </Text>
</View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>

                    <View style={{ alignItems: 'center' , gap: 12}}>
                      
                      <View style={{}}>
                        {/* <Image style={{ top: '50%'}} source={require('../assets/scan.png')} /> */}
                        <View  style={{left: '35%' , }}>
                            <Text style={{ color: '#666666'}}>Scanned From</Text>
                            <Text style={{ color: '#28303C', fontWeight: 600, fontSize: 16}}>BLOCK A</Text>
                        </View>
                      </View>

                      <View style={{flexDirection: 'row'}}>
                        {/* <Image style={{ top: '3%'}} source={require('../assets/station.png')} /> */}
                        <View style={{left: '35%'}}>
                            <Text style={{ color: '#666666'}}>Next Station</Text>
                            <Text style={{ color: '#28303C' , fontWeight: 600, fontSize: 16}}>BLOCK B</Text>
                        </View>
                      </View>
                    </View>

                {/* <View>
                    <Image source={require('../assets/line.png')} />
                </View> */}
                    <View style={{ alignItems: 'center' , top: '5%'}}>

                       {/* <Image source={require('../assets/bike.png')} /> */}
                        <Text style={{ top: '-20%'}}>ID-2341 </Text>
                    </View>
                </View>



                <TouchableOpacity style={{
                        backgroundColor: '#28303C', height: 40, width: 200,
                        justifyContent: 'center', 
                        alignSelf: 'center',
                        borderRadius: 10,
                        shadowColor: 'rgba(212, 210, 212, 1, 0.5)',
                        shadowOpacity: 0.2,
                        shadowRadius: 10,
                        shadowOffset: { width: 1, height: 8 },
                }} 
                onPress={() => navigation.navigate('end')}>
                     <Text style={{ color: 'white', alignSelf: 'center', fontWeight: 800, fontSize: 16 }}>START RIDE </Text>
                </TouchableOpacity>


            </View>



        </View>
    )
}

export default Start
