const express = require("express");
const Habit = require("../models/Habit");
const authMiddleware = require("../middleware/authMiddleware");
const Mine = require("../models/Mine");
const allowedCategories = require("../data/categories");
const UserCategory = require("../models/UserCategory");

const router = express.Router();

// Получить все привычки пользователя
router.get("/", authMiddleware, async (req, res) => {
  const habits = await Habit.find({ userId: req.user.userId });
  res.json(habits);
});

// Отметить выполнение (добавить дату)
router.post("/:id/complete", authMiddleware, async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!habit) return res.status(404).json({ message: "Привычка не найдена" });

    const today = new Date().toDateString();
    const alreadyCompleted = habit.completedDates.some(
      (date) => new Date(date).toDateString() === today
    );
    if (alreadyCompleted)
      return res.status(400).json({ message: "Сегодня уже отмечено" });

    habit.completedDates.push(new Date());
    await habit.save();

    res.json(habit);
  } catch (err) {
    res.status(500).json({ message: `Ошибка при отметке привычки: ${err}` });
  }
});

// Удалить привычку
router.delete("/:id", authMiddleware, async (req, res) => {
  await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
  res.json({ message: "Привычка удалена" });
});

// Создать привычку + шахту
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      description,
      frequency,
      mineType = "gold",
      category,
      customCategory,
    } = req.body;

    const isAllowedCategory = allowedCategories.includes(category);

    const isUserCustomCategory = await UserCategory.findOne({
      userId: req.user.userId,
      name: category,
    });

    if (!isAllowedCategory && !isUserCustomCategory) {
      return res.status(400).json({ message: "Недопустимая категория" });
    }

    const habit = new Habit({
      userId: req.user.userId,
      name,
      description,
      frequency,
      category,
      customCategory,
    });

    await habit.save();

    const mine = new Mine({
      habitId: habit._id,
      userId: req.user.userId,
      type: mineType,
    });
    await mine.save();

    res.status(201).json({ habit, mine });
  } catch (err) {
    res.status(400).json({ message: `Ошибка при создании привычки: ${err}` });    
  }
});

router.get("/categories", (req, res) => {
  const categories = require("../data/categories");
  res.json(categories);
});

router.post("/user-categories", authMiddleware, async (req, res) => {
    const { name } = req.body;
    if (!name || name.length < 2)
        return res.status(400).json({ message: "Неверное имя категории" });

    const existing = await UserCategory.findOne({
        userId: req.user.userId,
        name,
    });
    if (existing)
        return res.status(400).json({ message: "Такая категория уже существует" });

    const newCategory = new UserCategory({ userId: req.user.userId, name });
    await newCategory.save();

    res.status(201).json(newCategory);
});

module.exports = router;
