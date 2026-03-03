const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Hospital = require('./models/Hospital');

dotenv.config();

const hospitals = [
    {
        name: 'City Care Emergency Hospital',
        address: '123 Medical Square, North Region',
        phone: '9876543210',
        location: { type: 'Point', coordinates: [79.125, 11.085] }, // Near the user
        services: ['Emergency', 'ICU', 'Radiology'],
        specializations: ['General Medicine', 'Cardiology'],
        emergencyAvailable: true,
        rating: 4.8
    },
    {
        name: 'Grace Memorial Hospital',
        address: '45 Health Avenue, South District',
        phone: '9876543211',
        location: { type: 'Point', coordinates: [79.145, 11.105] }, // Near the user
        services: ['Paediatrics', 'Surgery', 'Diagnostics'],
        specializations: ['Orthopedics', 'Pediatrics'],
        emergencyAvailable: false,
        rating: 4.5
    }
];

const seedHospitals = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart-doctor-db');
        console.log('Connected to MongoDB');

        // Clear old placeholder hospitals with 0,0 or dummy names
        await Hospital.deleteMany({ 'location.coordinates': [0, 0] });

        // Insert real ones
        await Hospital.insertMany(hospitals);
        console.log('Sample hospitals with real coordinates added!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedHospitals();
