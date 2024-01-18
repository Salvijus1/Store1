import React, { useState, useEffect } from 'react';
import { View, Image, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import HomeScreen from './HomeScreen';
import RegisterScreen from './RegisterScreen';
import LoginScreen from './LoginScreen';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';


const coffeeMenu = [
  { id: 1, name: 'Espresso', price: 2.5, image: require('./assets/espresso.jpg') },
  { id: 2, name: 'Latte', price: 3.5, image: require('./assets/latte.jpg') },
  { id: 3, name: 'Cappuccino', price: 4.0, image: require('./assets/cappuccino.jpg') },
  // Add more coffee items as needed
];

const MainApp = () => {
  const navigation = useNavigation();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const user = JSON.parse(storedUser);
        if (user) {
          setUserName(user.username);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Check if order is placed, then generate and store QR code data
    if (orderPlaced) {
      const qrCodeData = {
        selectedItems,
        totalAmount: calculateTotalAmount(),
        orderId,
        userName,
      };
      AsyncStorage.setItem('qrCodeData', JSON.stringify(qrCodeData));
    }
  }, [orderPlaced, selectedItems, calculateTotalAmount, orderId, userName]);

  const toggleItemSelection = (itemId) => {
    const index = selectedItems.indexOf(itemId);
    if (index === -1) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      const updatedItems = [...selectedItems];
      updatedItems.splice(index, 1);
      setSelectedItems(updatedItems);
    }
  };

  const placeOrder = () => {
    setOrderId(generateRandomOrderId());
    setOrderPlaced(true);
  };

  const resetOrder = () => {
    setOrderPlaced(false);
    setSelectedItems([]);
    setOrderId(null);
  };

  const calculateTotalAmount = () => {
    return selectedItems.reduce((total, itemId) => {
      const selectedItem = coffeeMenu.find((item) => item.id === itemId);
      return total + selectedItem.price;
    }, 0);
  };

  const generateRandomOrderId = () => {
    return Math.floor(Math.random() * 100000);
  };

  const logout = () => {
    navigation.navigate('HomeScreen');
  };

  const handleOrderCompletion = (orderId) => {
    // Handle the logic for completing the order
    console.log(`Order completed in WorkersApp with orderId: ${orderId}`);
    // You can update the UI or perform any necessary actions
    // For example, reset the order state
    setOrderPlaced(false);
    setSelectedItems([]);
    setOrderId(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('./assets/cafe_logo.png')} style={styles.logo} />
      <Text style={styles.header}>Cafe Ordering App</Text>

      <ScrollView contentContainerStyle={styles.menuContainer}>
        {!orderPlaced ? (
          <>
            {coffeeMenu.map((item) => (
              <View key={item.id} style={styles.menuItemContainer}>
                <TouchableOpacity
                  style={[styles.menuItem, selectedItems.includes(item.id) && styles.selectedItem]}
                  onPress={() => toggleItemSelection(item.id)}
                >
                  <Text style={styles.menuItemText}>{item.name} - ${item.price}</Text>
                </TouchableOpacity>
                <Image source={item.image} style={styles.coffeeImage} />
              </View>
            ))}
            <TouchableOpacity style={styles.button} onPress={placeOrder}>
              <Text style={styles.buttonText}>Place Order</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.successContainer}>
            <Text style={styles.successMessage}>Order Placed Successfully!</Text>
            <Text style={styles.orderedItems}>
              Ordered Items:
              {selectedItems.map((itemId) => {
                const selectedItem = coffeeMenu.find((item) => item.id === itemId);
                return (
                  <View key={itemId} style={styles.orderedItem}>
                    <Text>{selectedItem.name}</Text>
                    <Image source={selectedItem.image} style={styles.orderedItemImage} />
                  </View>
                );
              })}
            </Text>
            <Text style={styles.totalAmount}>Total Amount: €{calculateTotalAmount().toFixed(2)}</Text>
            <Text style={styles.orderId}>Order ID: {orderId}</Text>
            {userName && <Text style={styles.userName}>Name: {userName}</Text>}
            <TouchableOpacity style={styles.button} onPress={resetOrder}>
              <Text style={styles.buttonText}>Place Another Order</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.qrCodeContainer}>
          {orderPlaced && (
            <>
              <Text style={styles.qrCodeText}>Scan QR Code for Order Details</Text>
              <QRCode
                value={JSON.stringify({
                  selectedItems,
                  totalAmount: calculateTotalAmount(),
                  orderId,
                  userName,
                })}
                size={200}
              />
            </>
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f1e3', // Light beige for a cozy feel
    paddingTop: 40, // Added padding at the top
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2d3436', // Dark gray for better readability
  },
  menuContainer: {
    alignItems: 'center',
    paddingBottom: 60, // Adjusted paddingBottom to move it down
  },
  menuItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    marginVertical: 8,
  },
  menuItem: {
    backgroundColor: '#ecf0f1', // Light gray for menu items
    padding: 15,
    borderRadius: 8,
    width: '60%',
  },
  selectedItem: {
    backgroundColor: '#3498db', // Highlight color for selected items
  },
  menuItemText: {
    fontSize: 16,
    color: '#2d3436',
  },
  coffeeImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  button: {
    backgroundColor: '#e17055', // Salmon color for the button
    padding: 15,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginTop: 20,
    marginBottom: 10, // Adjusted marginBottom to move it down
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  successContainer: {
    alignItems: 'center',
  },
  successMessage: {
    fontSize: 18,
    color: 'black', // Black text color for success message
    fontWeight: 'bold',
    marginBottom: 20,
  },
  orderedItems: {
    fontSize: 16,
    color: '#2d3436',
    marginTop: 10,
  },
  orderedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  orderedItemImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 10,
  },
  totalAmount: {
    fontSize: 18,
    color: '#2d3436',
    fontWeight: 'bold',
    marginTop: 10,
  },
  orderId: {
    fontSize: 16,
    color: '#2d3436',
    marginTop: 5,
  },
  userName: {
    fontSize: 16,
    color: '#2d3436',
    marginTop: 5,
  },
  logoutButton: {
    backgroundColor: '#e17055',
    padding: 10,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginTop: 10,
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  qrCodeText: {
    fontSize: 18,
    color: '#2d3436',
    marginBottom: 10,
  },
});

export default MainApp;