# Pet Hub - React Native App

A simple React Native app built with Expo Go for managing pet information, medical records, appointments, and reminders.

## Features

### CRUDE Operations
- **Create**: Add new pets with their information
- **Read**: View list of all pets and their details
- **Update**: Edit existing pet information
- **Delete**: Remove pets from the database
- **Evaluate**: Check off reminders and track completion status

### Pet Management
- Pet profiles with basic information (name, breed, age, weight, owner)
- Medical records tracking
- Appointment scheduling
- Reminder system for vaccines, checkups, and pet birthdays

## Database Structure

The app uses AsyncStorage for data persistence with the following data structures:
- `pets`: Basic pet information
- `medical_records`: Medical history and vet visits
- `appointments`: Scheduled vet visits and grooming
- `reminders`: Vaccination and medication reminders

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open the Expo Go app on your mobile device and scan the QR code

## App Structure

- `App.js`: Main app component with navigation setup
- `database.js`: AsyncStorage data operations and storage management
- `screens/`: Individual screen components
  - `PetListScreen.js`: Main screen showing all pets
  - `AddPetScreen.js`: Form to add new pets
  - `PetDetailScreen.js`: Detailed view with tabs for info, medical, appointments, and reminders
  - `EditPetScreen.js`: Form to edit existing pet information

## Usage

1. **Add a Pet**: Tap the + button to add a new pet with their basic information
2. **View Pets**: See all your pets in a simple list format
3. **Pet Details**: Tap on any pet to view detailed information across different tabs
4. **Edit Pet**: Use the Edit button to modify pet information
5. **Delete Pet**: Use the Delete button to remove a pet (with confirmation)
6. **Manage Reminders**: Add and check off reminders for vaccines and appointments

## Technologies Used

- React Native with Expo
- AsyncStorage for local data persistence
- React Navigation for screen navigation
- Simple, clean UI with minimal dependencies

## Requirements

- Node.js
- Expo CLI
- Expo Go app on your mobile device
- iOS or Android device for testing
