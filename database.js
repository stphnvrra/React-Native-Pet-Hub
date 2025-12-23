import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const PETS_KEY = 'pets';
const MEDICAL_RECORDS_KEY = 'medical_records';
const APPOINTMENTS_KEY = 'appointments';
const REMINDERS_KEY = 'reminders';
const OWNERS_KEY = 'owners';
const ADMINS_KEY = 'admins';

// Initialize database - create empty arrays if they don't exist
export const initDatabase = async () => {
  try {
    const pets = await AsyncStorage.getItem(PETS_KEY);
    if (!pets) {
      await AsyncStorage.setItem(PETS_KEY, JSON.stringify([]));
    }

    const medicalRecords = await AsyncStorage.getItem(MEDICAL_RECORDS_KEY);
    if (!medicalRecords) {
      await AsyncStorage.setItem(MEDICAL_RECORDS_KEY, JSON.stringify([]));
    }

    const appointments = await AsyncStorage.getItem(APPOINTMENTS_KEY);
    if (!appointments) {
      await AsyncStorage.setItem(APPOINTMENTS_KEY, JSON.stringify([]));
    }

    const reminders = await AsyncStorage.getItem(REMINDERS_KEY);
    if (!reminders) {
      await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify([]));
    }

    const owners = await AsyncStorage.getItem(OWNERS_KEY);
    if (!owners) {
      await AsyncStorage.setItem(OWNERS_KEY, JSON.stringify([]));
    }

    const admins = await AsyncStorage.getItem(ADMINS_KEY);
    if (!admins) {
      // Add default admin
      const defaultAdmin = [{
        id: 1,
        username: 'admin',
        password: 'admin123',
        name: 'System Administrator',
        role: 'admin',
        created_at: new Date().toISOString()
      }];
      await AsyncStorage.setItem(ADMINS_KEY, JSON.stringify(defaultAdmin));
    }

    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

// Pet CRUD operations
export const addPet = async (name, breed, age, weight, ownerName) => {
  try {
    const petsData = await AsyncStorage.getItem(PETS_KEY);
    const pets = petsData ? JSON.parse(petsData) : [];
    
    const newPet = {
      id: Date.now(), // Simple ID generation
      name,
      breed,
      age,
      weight,
      owner_name: ownerName,
      created_at: new Date().toISOString()
    };
    
    pets.push(newPet);
    await AsyncStorage.setItem(PETS_KEY, JSON.stringify(pets));
    return Promise.resolve(newPet.id);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getPets = async () => {
  try {
    const petsData = await AsyncStorage.getItem(PETS_KEY);
    const pets = petsData ? JSON.parse(petsData) : [];
    return Promise.resolve(pets.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updatePet = async (id, name, breed, age, weight, ownerName) => {
  try {
    const petsData = await AsyncStorage.getItem(PETS_KEY);
    const pets = petsData ? JSON.parse(petsData) : [];
    
    const petIndex = pets.findIndex(pet => pet.id === id);
    if (petIndex !== -1) {
      pets[petIndex] = {
        ...pets[petIndex],
        name,
        breed,
        age,
        weight,
        owner_name: ownerName
      };
      await AsyncStorage.setItem(PETS_KEY, JSON.stringify(pets));
    }
    
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deletePet = async (id) => {
  try {
    const petsData = await AsyncStorage.getItem(PETS_KEY);
    const pets = petsData ? JSON.parse(petsData) : [];
    
    const filteredPets = pets.filter(pet => pet.id !== id);
    await AsyncStorage.setItem(PETS_KEY, JSON.stringify(filteredPets));
    
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

// Medical records operations
export const addMedicalRecord = async (petId, type, description, date, vetName) => {
  try {
    const recordsData = await AsyncStorage.getItem(MEDICAL_RECORDS_KEY);
    const records = recordsData ? JSON.parse(recordsData) : [];
    
    const newRecord = {
      id: Date.now(),
      pet_id: petId,
      type,
      description,
      date,
      vet_name: vetName
    };
    
    records.push(newRecord);
    await AsyncStorage.setItem(MEDICAL_RECORDS_KEY, JSON.stringify(records));
    return Promise.resolve(newRecord.id);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getMedicalRecords = async (petId) => {
  try {
    const recordsData = await AsyncStorage.getItem(MEDICAL_RECORDS_KEY);
    const records = recordsData ? JSON.parse(recordsData) : [];
    
    const petRecords = records
      .filter(record => record.pet_id === petId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return Promise.resolve(petRecords);
  } catch (error) {
    return Promise.reject(error);
  }
};

// Appointments operations
export const addAppointment = async (petId, type, date, time, description) => {
  try {
    const appointmentsData = await AsyncStorage.getItem(APPOINTMENTS_KEY);
    const appointments = appointmentsData ? JSON.parse(appointmentsData) : [];
    
    const newAppointment = {
      id: Date.now(),
      pet_id: petId,
      type,
      date,
      time,
      description,
      status: 'scheduled'
    };
    
    appointments.push(newAppointment);
    await AsyncStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
    return Promise.resolve(newAppointment.id);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getAppointments = async (petId) => {
  try {
    const appointmentsData = await AsyncStorage.getItem(APPOINTMENTS_KEY);
    const appointments = appointmentsData ? JSON.parse(appointmentsData) : [];
    
    const filteredAppointments = petId
      ? appointments.filter(appointment => appointment.pet_id === petId)
      : appointments;

    return Promise.resolve(
      filteredAppointments.sort((a, b) => new Date(b.date) - new Date(a.date))
    );
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getAllAppointments = async () => getAppointments();

// Reminders operations
export const addReminder = async (petId, type, title, description, date) => {
  try {
    const remindersData = await AsyncStorage.getItem(REMINDERS_KEY);
    const reminders = remindersData ? JSON.parse(remindersData) : [];
    
    const newReminder = {
      id: Date.now(),
      pet_id: petId,
      type,
      title,
      description,
      date,
      is_completed: false
    };
    
    reminders.push(newReminder);
    await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
    return Promise.resolve(newReminder.id);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getReminders = async (petId) => {
  try {
    const remindersData = await AsyncStorage.getItem(REMINDERS_KEY);
    const reminders = remindersData ? JSON.parse(remindersData) : [];
    
    const filteredReminders = petId
      ? reminders.filter(reminder => reminder.pet_id === petId)
      : reminders;

    return Promise.resolve(
      filteredReminders.sort((a, b) => new Date(b.date) - new Date(a.date))
    );
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getAllReminders = async () => getReminders();

export const updateReminderStatus = async (id, isCompleted) => {
  try {
    const remindersData = await AsyncStorage.getItem(REMINDERS_KEY);
    const reminders = remindersData ? JSON.parse(remindersData) : [];
    
    const reminderIndex = reminders.findIndex(reminder => reminder.id === id);
    if (reminderIndex !== -1) {
      reminders[reminderIndex].is_completed = isCompleted;
      await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
    }
    
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

// Owner management operations
export const addOwner = async (name, email, phone, address) => {
  try {
    const ownersData = await AsyncStorage.getItem(OWNERS_KEY);
    const owners = ownersData ? JSON.parse(ownersData) : [];
    
    const newOwner = {
      id: Date.now(),
      name,
      email,
      phone,
      address,
      created_at: new Date().toISOString()
    };
    
    owners.push(newOwner);
    await AsyncStorage.setItem(OWNERS_KEY, JSON.stringify(owners));
    return Promise.resolve(newOwner.id);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getOwners = async () => {
  try {
    const ownersData = await AsyncStorage.getItem(OWNERS_KEY);
    const owners = ownersData ? JSON.parse(ownersData) : [];
    return Promise.resolve(owners.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deleteOwner = async (id) => {
  try {
    const ownersData = await AsyncStorage.getItem(OWNERS_KEY);
    const owners = ownersData ? JSON.parse(ownersData) : [];
    
    const filteredOwners = owners.filter(owner => owner.id !== id);
    await AsyncStorage.setItem(OWNERS_KEY, JSON.stringify(filteredOwners));
    
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

// Admin authentication
export const authenticateAdmin = async (username, password) => {
  try {
    const adminsData = await AsyncStorage.getItem(ADMINS_KEY);
    const admins = adminsData ? JSON.parse(adminsData) : [];
    
    const admin = admins.find(admin => 
      admin.username === username && admin.password === password
    );
    
    return Promise.resolve(admin || null);
  } catch (error) {
    return Promise.reject(error);
  }
};

// Enhanced pet operations with owner linking
export const addPetWithOwner = async (name, breed, age, weight, ownerId, ownerName) => {
  try {
    const petsData = await AsyncStorage.getItem(PETS_KEY);
    const pets = petsData ? JSON.parse(petsData) : [];
    
    const newPet = {
      id: Date.now(),
      name,
      breed,
      age,
      weight,
      owner_id: ownerId,
      owner_name: ownerName,
      created_at: new Date().toISOString()
    };
    
    pets.push(newPet);
    await AsyncStorage.setItem(PETS_KEY, JSON.stringify(pets));
    return Promise.resolve(newPet.id);
  } catch (error) {
    return Promise.reject(error);
  }
};

// Get pets by owner
export const getPetsByOwner = async (ownerId) => {
  try {
    const petsData = await AsyncStorage.getItem(PETS_KEY);
    const pets = petsData ? JSON.parse(petsData) : [];
    
    const ownerPets = pets
      .filter(pet => pet.owner_id === ownerId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    return Promise.resolve(ownerPets);
  } catch (error) {
    return Promise.reject(error);
  }
};