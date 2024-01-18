import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
  
    const handleLogin = async () => {
      // Simulate server-side authentication
      const storedUser = await AsyncStorage.getItem('user');
      const user = JSON.parse(storedUser);
  
      if (user && user.username === username && user.password === password) {
        navigation.navigate('MainApp'); // Navigate to your main app screen (change 'Home' to 'MainApp')
      } else {
        setError('Invalid username or password');
      }
    };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerLink}>Don't have an account? Register here</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f1e3',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2d3436',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#3498db',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    padding: 10,
  },
  button: {
    backgroundColor: '#e17055',
    padding: 15,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerLink: {
    marginTop: 20,
    color: '#3498db',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
