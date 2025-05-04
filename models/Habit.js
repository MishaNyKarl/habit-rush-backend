const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  name: { type: String, required: true, maxlength: 32 },
  description: { type: String },
  
  category: { type: String, required: true },
  customCategory: { type: String },

  frequency: { 
    type: [String], 
    enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], 
    required: true 
  },

  completedDates: { type: [Date], default: [] }, // для календаря выполнения

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Habit', HabitSchema);