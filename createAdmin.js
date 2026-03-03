const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
    try {
        const adminData = {
            name: 'System Admin',
            email: 'admin@smartdoctor.com',
            password: 'adminpassword123',
            role: 'admin',
            phone: '0000000000'
        };

        console.log(`Checking if admin exists: ${adminData.email}...`);
        const existing = await User.findOne({ email: adminData.email });

        if (existing) {
            console.log('✅ Admin already exists.');
            console.log(`Email: ${existing.email}, Role: ${existing.role}`);

            if (existing.role !== 'admin') {
                console.log('⚠️ Alert: User exists but role is NOT admin. Updating...');
                existing.role = 'admin';
                await existing.save();
                console.log('✅ Role updated to admin.');
            }
        } else {
            console.log('⏳ Creating new admin user...');
            const newAdmin = await User.create(adminData);
            console.log('🚀 Admin created successfully!');
            console.log(`Email: ${newAdmin.email}`);
            console.log(`Password: ${adminData.password}`);
        }

        console.log('\n--- Demo Doctor ---');
        const doctorData = {
            name: 'Dr. John Demo',
            email: 'doctor@demo.com',
            password: 'password123',
            role: 'doctor',
            phone: '9876543210'
        };

        const existingDoc = await User.findOne({ email: doctorData.email });
        if (!existingDoc) {
            console.log('⏳ Creating demo doctor user...');
            await User.create(doctorData);
            console.log('✅ Demo doctor created.');
        } else {
            console.log('✅ Demo doctor already exists.');
        }

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        mongoose.connection.close();
    }
};

mongoose.connect(process.env.MONGO_URI, { family: 4 })
    .then(() => {
        console.log('Connected to Database.');
        createAdmin();
    })
    .catch(err => {
        console.error('Connection Failed:', err.message);
    });
