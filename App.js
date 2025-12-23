import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { initDatabase } from './database';
import PetListScreen from './screens/PetListScreen';
import AddPetScreen from './screens/AddPetScreen';
import PetDetailScreen from './screens/PetDetailScreen';
import EditPetScreen from './screens/EditPetScreen';
import LoginScreen from './screens/LoginScreen';
import AdminPanel from './screens/AdminPanel';
import OwnerListScreen from './screens/OwnerListScreen';
import AddOwnerScreen from './screens/AddOwnerScreen';

const Stack = createStackNavigator();

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    const initializeDB = async () => {
      try {
        await initDatabase();
        setDbInitialized(true);
      } catch (error) {
        console.error('Database initialization failed:', error);
      }
    };

    initializeDB();
  }, []);

  if (!dbInitialized) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: 'Pet Hub - Login' }}
        />
        <Stack.Screen 
          name="AdminPanel" 
          component={AdminPanel} 
          options={{ title: 'Admin Panel' }}
        />
        <Stack.Screen 
          name="PetList" 
          component={PetListScreen} 
          options={{ title: 'Pet Hub - My Pets' }}
        />
        <Stack.Screen 
          name="AddPet" 
          component={AddPetScreen} 
          options={{ title: 'Add New Pet' }}
        />
        <Stack.Screen 
          name="PetDetail" 
          component={PetDetailScreen} 
          options={{ title: 'Pet Details' }}
        />
        <Stack.Screen 
          name="EditPet" 
          component={EditPetScreen} 
          options={{ title: 'Edit Pet' }}
        />
        <Stack.Screen 
          name="OwnerList" 
          component={OwnerListScreen} 
          options={{ title: 'Pet Owners' }}
        />
        <Stack.Screen 
          name="AddOwner" 
          component={AddOwnerScreen} 
          options={{ title: 'Add New Owner' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
