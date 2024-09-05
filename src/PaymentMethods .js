import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, TextInput, FlatList, Modal, Pressable } from 'react-native';

const PaymentMethods = ({ navigation }) => {
  const [paymentMethods, setPaymentMethods] = useState([
    { id: '1', method: 'Credit Card - **** 1234' },
    { id: '2', method: 'PayPal' },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newMethod, setNewMethod] = useState('');

  const handleAddMethod = () => {
    if (newMethod) {
      setPaymentMethods([...paymentMethods, { id: Date.now().toString(), method: newMethod }]);
      setNewMethod('');
      setModalVisible(false);
    }
  };

  const handleRemoveMethod = (id) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Methods</Text>

      <FlatList
        data={paymentMethods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.methodCard}>
            <Text style={styles.methodText}>{item.method}</Text>
            <TouchableOpacity onPress={() => handleRemoveMethod(item.id)} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Add Payment Method</Text>
      </TouchableOpacity>

      {/* Modal for Adding Payment Method */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Payment Method</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter payment method details"
              value={newMethod}
              onChangeText={setNewMethod}
            />
            <Pressable style={styles.modalButton} onPress={handleAddMethod}>
              <Text style={styles.modalButtonText}>Add Method</Text>
            </Pressable>
            <Pressable style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  methodCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  methodText: { fontSize: 16 },
  removeButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  removeButtonText: { color: '#fff' },
  addButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  addButtonText: { color: '#fff', textAlign: 'center' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  modalButtonText: { color: '#fff', textAlign: 'center' },
});

export default PaymentMethods;
