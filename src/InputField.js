import React, { useState } from 'react';
import { TextInput, View, Image, TouchableOpacity, StyleSheet, Text} from 'react-native';

const InputField = ({ placeholder, isPassword, leftImg, isEmail, ...rest }) => {
 const [ isShow, setIsShow] = useState(true);

  return (
      <View style={styles.inputContainer}>
        {leftImg && (
          <Image
            source={leftImg}
            style={styles.Licon}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          secureTextEntry={isShow}
          placeholderTextColor="#666666"
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setIsShow((prev) => !prev )} style={styles.iconContainer}>
            <Image
              source={require('../assets/eye.png')} 
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
      </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#666666',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 5,
    width: 299,
    height: 46,
    fontFamily: 'InterMedium',
    fontSize: 14,
 borderBottomWidth: 1



  },
  
  input: {
    flex: 1,
    height: 40,
    color: '#666666',
    fontSize: 14,
    fontFamily: 'InterMedium',
    marginLeft: 5,
  },
  iconContainer: {
    padding: 0,
  },
  icon: {
    width: 22,
    height: 20,
    resizeMode: 'contain',
    right: -4
  },
  Licon: {
    width: 19,
    height: 18,
    resizeMode: 'contain',
    marginRight: 10
  },
});

export default InputField;
