import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { getOwners, deleteOwner } from '../database';

const OwnerListScreen = ({ navigation }) => {
  const [owners, setOwners] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadOwners = useCallback(async () => {
    try {
      const ownersData = await getOwners();
      setOwners(ownersData);
    } catch (error) {
      console.error('Error loading owners:', error);
      Alert.alert('Error', 'Failed to load owners');
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadOwners);
    loadOwners();
    return unsubscribe;
  }, [navigation, loadOwners]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadOwners();
    setRefreshing(false);
  }, [loadOwners]);

  const handleDeleteOwner = (ownerId, ownerName) => {
    Alert.alert(
      'Delete Owner',
      `Are you sure you want to delete ${ownerName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteOwner(ownerId);
              await loadOwners();
              Alert.alert('Success', 'Owner deleted successfully');
            } catch (error) {
              console.error('Error deleting owner:', error);
              Alert.alert('Error', 'Failed to delete owner');
            }
          },
        },
      ]
    );
  };

  const renderOwnerItem = ({ item }) => (
    <View style={styles.ownerItem}>
      <View style={styles.ownerInfo}>
        <Text style={styles.ownerName}>{item.name}</Text>
        <Text style={styles.ownerDetails}>{item.email}</Text>
        <Text style={styles.ownerDetails}>{item.phone}</Text>
        <Text style={styles.ownerAddress}>{item.address}</Text>
      </View>
      <View style={styles.ownerActions}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteOwner(item.id, item.name)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {owners.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No owners added yet</Text>
          <Text style={styles.emptySubtext}>Tap the + button to add your first owner</Text>
        </View>
      ) : (
        <FlatList
          data={owners}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOwnerItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
        />
      )}
      
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddOwner')}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  ownerItem: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  ownerDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  ownerAddress: {
    fontSize: 12,
    color: '#888',
  },
  ownerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2196F3',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default OwnerListScreen;
