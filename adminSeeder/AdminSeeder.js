import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Admin from '../model/Admin.js';

const dbConnectionString = 'mongodb://127.0.0.1:27017/ECOMMERCEAPP';

mongoose.connect(dbConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');

    const adminData = {
        name: 'admin',
        email: 'admin@gmail.com',
        password: 'admin@123' 
    };

    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            console.error('Error generating salt:', err);
            mongoose.connection.close();
            return;
        }
        bcrypt.hash(adminData.password, salt, async (err, hash) => {
            if (err) {
                console.error('Error hashing password:', err);
                mongoose.connection.close();
                return;
            }

            
            adminData.password = hash;

            
            try {
                const existingAdmin = await Admin.findOne({ email: adminData.email });
                if (existingAdmin) {
                    console.log('Admin user already exists.');
                    mongoose.connection.close();
                    return;
                }

                
                const newAdmin = await Admin.create(adminData);
                console.log('Admin user created:', newAdmin);

                mongoose.connection.close();
                console.log('MongoDB connection closed.');
            } catch (err) {
                console.error('Error finding or creating admin:', err);
                mongoose.connection.close();
            }
        });
    });
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
});
