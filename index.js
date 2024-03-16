// app.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const foodRoutes = require('./routes/food');

const app = express();

// Body parser middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost/food_nutrition_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Routes
app.use('/api/food', foodRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));




// models/Food.js

const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  foodGroup: String,
  description: String,
  nutritionalInfo: {
    calories: Number,
    macronutrients: {
      proteins: Number,
      fats: Number,
      carbohydrates: Number
    },
    micronutrients: {
      vitamins: [String],
      minerals: [String]
    },
    fiber: Number,
    sodium: Number,
    cholesterol: Number
  },
  servingSize: String,
  allergens: [String],
  ingredients: [String],
  preparationMethods: [String],
  certifications: [String],
  countryOfOrigin: String,
  brandOrManufacturer: String,
  dietaryRestrictions: [String],
  healthBenefits: [String],
  bestPractices: String
});

module.exports = mongoose.model('Food', foodSchema);


// routes/food.js

const express = require('express');
const router = express.Router();
const Food = require('../models/Food');

// Create a new food item
router.post('/', async (req, res) => {
  try {
    const newFood = new Food(req.body);
    const savedFood = await newFood.save();
    res.json(savedFood);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all food items
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific food item by ID
router.get('/:id', getFood, (req, res) => {
  res.json(res.food);
});

// Update a food item
router.put('/:id', getFood, async (req, res) => {
  try {
    Object.assign(res.food, req.body);
    const updatedFood = await res.food.save();
    res.json(updatedFood);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a food item
router.delete('/:id', getFood, async (req, res) => {
  try {
    await res.food.remove();
    res.json({ message: 'Food item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getFood(req, res, next) {
  let food;
  try {
    food = await Food.findById(req.params.id);
    if (food == null) {
      return res.status(404).json({ message: 'Food item not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.food = food;
  next();
}

module.exports = router;
