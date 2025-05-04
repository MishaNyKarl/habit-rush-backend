const mongoose = require('mongoose');

const MineSchema = new mongoose.Schema({
  habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  type: { type: String, enum: ['gold', 'crystal', 'emerald'], default: 'gold' },
  level: { type: Number, default: 1 },
  hp: { type: Number, default: 100 }, // "здоровье" шахты
  goldPerDay: { type: Number, default: 10 },
  broken: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Mine', MineSchema);
