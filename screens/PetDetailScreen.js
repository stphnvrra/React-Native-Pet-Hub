import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { getMedicalRecords, getAppointments, getReminders, addReminder, updateReminderStatus } from '../database';

const PetDetailScreen = ({ navigation, route }) => {
  const { pet } = route.params;
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [records, apps, rems] = await Promise.all([
        getMedicalRecords(pet.id),
        getAppointments(pet.id),
        getReminders(pet.id)
      ]);
      setMedicalRecords(records);
      setAppointments(apps);
      setReminders(rems);
    } catch (error) {
      console.error('Error loading pet data:', error);
    }
  };

  const handleToggleReminder = async (reminderId, currentStatus) => {
    try {
      await updateReminderStatus(reminderId, !currentStatus);
      await loadData();
    } catch (error) {
      console.error('Error updating reminder:', error);
      Alert.alert('Error', 'Failed to update reminder');
    }
  };

  const addSampleReminder = async () => {
    try {
      await addReminder(
        pet.id,
        'vaccine',
        'Annual Vaccination Due',
        'Time for annual vaccination checkup',
        new Date().toISOString()
      );
      await loadData();
      Alert.alert('Success', 'Sample reminder added');
    } catch (error) {
      console.error('Error adding reminder:', error);
      Alert.alert('Error', 'Failed to add reminder');
    }
  };

  const renderInfoTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Basic Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Name:</Text>
          <Text style={styles.infoValue}>{pet.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Breed:</Text>
          <Text style={styles.infoValue}>{pet.breed || 'Not specified'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Age:</Text>
          <Text style={styles.infoValue}>{pet.age ? `${pet.age} years` : 'Not specified'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Weight:</Text>
          <Text style={styles.infoValue}>{pet.weight ? `${pet.weight} kg` : 'Not specified'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Owner:</Text>
          <Text style={styles.infoValue}>{pet.owner_name}</Text>
        </View>
      </View>
    </View>
  );

  const renderMedicalTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Medical Records</Text>
        <TouchableOpacity style={styles.addButton} onPress={addSampleReminder}>
          <Text style={styles.addButtonText}>+ Add Record</Text>
        </TouchableOpacity>
      </View>
      
      {medicalRecords.length === 0 ? (
        <Text style={styles.emptyText}>No medical records yet</Text>
      ) : (
        medicalRecords.map((record) => (
          <View key={record.id} style={styles.recordCard}>
            <Text style={styles.recordType}>{record.type}</Text>
            <Text style={styles.recordDescription}>{record.description}</Text>
            <Text style={styles.recordDate}>
              {new Date(record.date).toLocaleDateString()}
            </Text>
            {record.vet_name && (
              <Text style={styles.vetName}>Vet: {record.vet_name}</Text>
            )}
          </View>
        ))
      )}
    </View>
  );

  const renderAppointmentsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Appointments</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Schedule</Text>
        </TouchableOpacity>
      </View>
      
      {appointments.length === 0 ? (
        <Text style={styles.emptyText}>No appointments scheduled</Text>
      ) : (
        appointments.map((appointment) => (
          <View key={appointment.id} style={styles.recordCard}>
            <Text style={styles.recordType}>{appointment.type}</Text>
            <Text style={styles.recordDescription}>{appointment.description}</Text>
            <Text style={styles.recordDate}>
              {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
            </Text>
            <Text style={[styles.status, 
              appointment.status === 'completed' ? styles.statusCompleted : styles.statusPending
            ]}>
              Status: {appointment.status}
            </Text>
          </View>
        ))
      )}
    </View>
  );

  const renderRemindersTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Reminders</Text>
        <TouchableOpacity style={styles.addButton} onPress={addSampleReminder}>
          <Text style={styles.addButtonText}>+ Add Reminder</Text>
        </TouchableOpacity>
      </View>
      
      {reminders.length === 0 ? (
        <Text style={styles.emptyText}>No reminders set</Text>
      ) : (
        reminders.map((reminder) => (
          <View key={reminder.id} style={styles.recordCard}>
            <View style={styles.reminderHeader}>
              <Text style={styles.recordType}>{reminder.title}</Text>
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  reminder.is_completed && styles.checkboxCompleted
                ]}
                onPress={() => handleToggleReminder(reminder.id, reminder.is_completed)}
              >
                <Text style={styles.checkboxText}>
                  {reminder.is_completed ? '✓' : ''}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.recordDescription}>{reminder.description}</Text>
            <Text style={styles.recordDate}>
              {new Date(reminder.date).toLocaleDateString()}
            </Text>
          </View>
        ))
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'info' && styles.activeTab]}
          onPress={() => setActiveTab('info')}
        >
          <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>
            Info
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'medical' && styles.activeTab]}
          onPress={() => setActiveTab('medical')}
        >
          <Text style={[styles.tabText, activeTab === 'medical' && styles.activeTabText]}>
            Medical
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'appointments' && styles.activeTab]}
          onPress={() => setActiveTab('appointments')}
        >
          <Text style={[styles.tabText, activeTab === 'appointments' && styles.activeTabText]}>
            Appointments
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'reminders' && styles.activeTab]}
          onPress={() => setActiveTab('reminders')}
        >
          <Text style={[styles.tabText, activeTab === 'reminders' && styles.activeTabText]}>
            Reminders
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'info' && renderInfoTab()}
        {activeTab === 'medical' && renderMedicalTab()}
        {activeTab === 'appointments' && renderAppointmentsTab()}
        {activeTab === 'reminders' && renderRemindersTab()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    width: 80,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  recordCard: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  recordDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  recordDate: {
    fontSize: 12,
    color: '#888',
  },
  vetName: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statusCompleted: {
    color: '#4CAF50',
  },
  statusPending: {
    color: '#FF9800',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 32,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkboxText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default PetDetailScreen;
