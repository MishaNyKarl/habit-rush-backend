require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express();
const authRoutes = require('./routes/authRoutes')


app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use('/api/auth', authRoutes);


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .then(err => console.error('Connection error:', err));

app.get('/', (req, res) => {
    res.send('HabitRush API is running...');
});

const habitRoutes = require('./routes/habitRoutes');
app.use('/api/habits', habitRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));