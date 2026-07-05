require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes'); // ✅ still import early

const doctorRoutes = require('./routes/shareRoutes'); // ✅ still import early

const app = express(); // ✅ must come before app.use()
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');

    // Optional: drop wallet index
    mongoose.connection.db.collection('users')
      .dropIndex('walletAddress_1')
      .then(() => console.log('✅ Dropped walletAddress index'))
      .catch(err => {
        if (err.message.includes('index not found')) {
          console.log('ℹ️ Index not found or already dropped');
        } else {
          console.error('❌ Error dropping index:', err.message);
        }
      });
  })
  .catch((err) => console.error('❌ MongoDB error:', err));

// Routes
app.use('/api', authRoutes);
app.use('/api', fileRoutes); // ✅ Correctly placed here
app.use('/uploads', express.static('uploads'));

app.use('/api/doctors', doctorRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
