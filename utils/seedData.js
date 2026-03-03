/**
 * Seed script - run with: node utils/seedData.js
 * Populates DB with sample hospitals and videos
 */
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Hospital = require('../models/Hospital');
const Video = require('../models/Video');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

const hospitals = [
  {
    name: 'City General Hospital', address: '12 Main Street, Downtown', phone: '555-0101',
    location: { type: 'Point', coordinates: [77.2090, 28.6139] },
    services: ['Emergency', 'Surgery', 'Cardiology', 'Pediatrics'],
    specializations: ['Cardiology', 'Neurology'], emergencyAvailable: true, beds: 200, openHours: '24/7', rating: 4.5
  },
  {
    name: 'Green Valley Medical Center', address: '45 Park Avenue, Uptown', phone: '555-0202',
    location: { type: 'Point', coordinates: [77.2300, 28.6300] },
    services: ['OPD', 'Maternity', 'Orthopedics'], specializations: ['Orthopedics', 'Gynecology'],
    emergencyAvailable: false, beds: 120, openHours: '8AM-10PM', rating: 4.2
  },
  {
    name: 'Apollo Multispecialty', address: '78 Health Road, Suburbs', phone: '555-0303',
    location: { type: 'Point', coordinates: [77.1900, 28.6000] },
    services: ['ICU', 'Dialysis', 'Oncology', 'Radiology'],
    specializations: ['Oncology', 'Nephrology'], emergencyAvailable: true, beds: 350, openHours: '24/7', rating: 4.8
  },
  {
    name: 'Sunrise Children Hospital', address: '99 Kids Lane, East Side', phone: '555-0404',
    location: { type: 'Point', coordinates: [77.2500, 28.6500] },
    services: ['Pediatrics', 'NICU', 'Child Surgery'], specializations: ['Pediatrics'],
    emergencyAvailable: true, beds: 80, openHours: '24/7', rating: 4.7
  },
];

const videos = [
  { title: 'Understanding Heart Disease', youtubeId: 'MbVqf-vPsGQ', category: 'heart', description: 'Learn about common heart conditions.' },
  { title: 'Managing Type 2 Diabetes', youtubeId: 'A3VVFMDQ7a0', category: 'diabetes', description: 'Expert guide on managing diabetes.' },
  { title: 'Mental Health Awareness', youtubeId: 'rkZl2gsLUp4', category: 'mental', description: 'Breaking the stigma.' },
  { title: 'Healthy Eating Habits', youtubeId: 'RpkST1tO_e8', category: 'nutrition', description: 'Nutrition tips.' },
  { title: 'Yoga for Heart Health', youtubeId: 'v7AYKMP6rOE', category: 'heart', description: 'Heart-beneficial yoga.' },
  { title: 'Diabetes Diet Guide', youtubeId: 'Cb8RWGvFJdk', category: 'diabetes', description: 'Foods for diabetes management.' },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart-doctor-db');
  console.log('Connected to MongoDB');

  // Clear collections
  await Promise.all([Hospital.deleteMany({}), Video.deleteMany({})]);

  // Insert data
  await Hospital.insertMany(hospitals);
  await Video.insertMany(videos);

  // Create demo admin user
  const adminExists = await User.findOne({ email: 'demo@1.com' });
  if (!adminExists) {
    const admin = await User.create({ name: 'Admin', email: 'demo@1.com', password: '1234', role: 'admin', phone: '9999999999' });
    console.log('✅ Admin created: demo@1.com / 1234');
  }

  // Create demo doctor user
  const doctorExists = await User.findOne({ email: 'doctor@demo.com' });
  if (!doctorExists) {
    const docUser = await User.create({ name: 'Dr. Demo Smith', email: 'doctor@demo.com', password: 'password123', role: 'doctor', phone: '+91 9999888877' });
    await Doctor.create({
      user: docUser._id, specialization: 'Cardiologist', experience: 10, qualification: 'MBBS, MD Cardiology', bio: 'Expert cardiologist with 10 years of experience.', consultationFee: 500, isVerified: true,
      availability: [
        { day: 'Monday', startTime: '09:00', endTime: '17:00', isAvailable: true },
        { day: 'Wednesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
        { day: 'Friday', startTime: '09:00', endTime: '13:00', isAvailable: true },
      ]
    });
    console.log('✅ Doctor created: doctor@demo.com / password123');
  }

  // Create demo patient user
  const patientExists = await User.findOne({ email: 'patient@demo.com' });
  if (!patientExists) {
    await User.create({ name: 'Demo Patient', email: 'patient@demo.com', password: 'password123', role: 'patient', phone: '+91 9876543210', emergencyContact: { name: 'Emergency Contact', phone: '+91 9876543211', email: 'emergency@demo.com' } });
    console.log('✅ Patient created: patient@demo.com / password123');
  }

  console.log('✅ Hospitals seeded:', hospitals.length);
  console.log('✅ Videos seeded:', videos.length);
  console.log('\n🚀 Database seeded successfully!');
  process.exit(0);
}

seed().catch(e => { console.error('Seed error:', e); process.exit(1); });
