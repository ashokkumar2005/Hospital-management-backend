/**
 * Run this script to create a new admin user:
 * node scripts/createAdmin.js <email> <password> <name>
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const createAdmin = async () => {
    try {
        const email = (process.argv[2] || 'admin@smartdoctor.com').trim().toLowerCase();
        const password = (process.argv[3] || 'admin123').trim();
        const name = (process.argv[4] || 'System Admin').trim();

        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart-doctor-db');
        console.log('Connected to MongoDB');

        const adminExists = await User.findOne({ email });
        if (adminExists) {
            console.log(`Admin with email ${email} already exists. Updating password...`);
            adminExists.password = password;
            await adminExists.save();
            console.log('✅ Admin Password Updated Successfully!');
        } else {
            await User.create({
                name,
                email,
                password,
                role: 'admin',
                phone: '0000000000'
            });
            console.log('✅ Admin Created Successfully!');
        }

        console.log('✅ Admin Created Successfully!');
        console.log('---------------------------');
        console.log(`Email:    ${email}`);
        console.log(`Password: ${password}`);
        console.log(`Name:     ${name}`);
        console.log('---------------------------');

        process.exit(0);
    } catch (err) {
        console.error('Error creating admin:', err);
        process.exit(1);
    }
};

createAdmin();
