const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000; // Change this to your desired port

// Connect to your MongoDB database
mongoose.connect('mongodb://localhost/your-database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to the database');
});

// Create a MongoDB model for phrases
const Phrase = mongoose.model('Phrase', {
  english: String,
  spanish: String
});

// API endpoint to get random phrases
app.get('/api/getRandomPhrases', async (req, res) => {
  try {
    const randomPhrases = await Phrase.aggregate([{ $sample: { size: 5 } }]); // Adjust the size as needed
    const englishPhrases = randomPhrases.map(phrase => phrase.english);
    const spanishPhrases = randomPhrases.map(phrase => phrase.spanish);

    res.json({ english: englishPhrases, spanish: spanishPhrases });
  } catch (error) {
    console.error('Error fetching phrases:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
