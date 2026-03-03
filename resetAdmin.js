const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');

dotenv.config({ path: path.join(__dirname, '.env') });

const reset = async () => {
    try {
        console.log('Connecting to Mongo...');
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 15000
        });
        console.log('Connected.');

        const email = 'admin@smartdoctor.com';
        const password = 'admin123';

        const user = await User.findOne({ email });
        if (!user) {
            console.log('Admin not found, creating new...');
            await User.create({
                name: 'System Admin',
                email,
                password,
                role: 'admin',
                phone: '0000000000'
            });
            console.log('✅ Admin Created with password: admin123');
        } else {
            console.log('Admin found, updating password...');
            user.password = password;
            await user.save();
            console.log('✅ Admin Password Reset to: admin123');
        }
        process.exit(0);
    } catch (err) {
        console.error('Error reset:', err);
        process.exit(1);
    }
};

reset();
