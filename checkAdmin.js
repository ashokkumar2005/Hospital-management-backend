const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const checkAdmin = async () => {
    try {
        const email = 'admin@smartdoctor.com';
        console.log(`Searching for admin: ${email}...`);

        const user = await User.findOne({ email });

        if (!user) {
            console.log(`❌ User ${email} NOT FOUND in database.`);
        } else {
            console.log(`✅ User Found:`);
            console.log(`- Email: ${user.email}`);
            console.log(`- Role:  ${user.role}`);
            console.log(`- Name:  ${user.name}`);
        }
    } catch (err) {
        console.error('❌ Database Query Error:', err.message);
        if (err.message.includes('SSL') || err.message.includes('alert 80')) {
            console.error('📢 TIP: This is an SSL error. Check your MongoDB Atlas IP whitelist!');
        }
    } finally {
        mongoose.connection.close();
    }
};

console.log('⏳ Connecting to MongoDB...');
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    family: 4
})
    .then(() => {
        console.log('✅ Connected.');
        checkAdmin();
    })
    .catch(err => {
        console.error('❌ Connection failed:', err.message);
        process.exit(1);
    });
