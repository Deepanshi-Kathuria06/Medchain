// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    
    // Add this block to drop the walletAddress index
    mongoose.connection.db.collection('users')
      .dropIndex('walletAddress_1')
      .then(() => console.log('Successfully dropped walletAddress unique index'))
      .catch(err => {
        if (err.message.includes('index not found')) {
          console.log('walletAddress index already removed or never existed');
        } else {
          console.error('Error dropping walletAddress index:', err.message);
        }
      });
  })
  .catch((err) => console.error(err));

app.use('/api', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));