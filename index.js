const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5000;

// Connect to the MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/sravani', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Database connected");
}).catch((err) => {
  console.error("Database connection error:", err);
});

// Create a Mongoose schema for the book
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
});

// Create a Mongoose model based on the schema
const Book = mongoose.model('Book', bookSchema);

// Create a new book
app.post('/api/books', (req, res) => {
  const { title, author, genre } = req.body;
  const newBook = new Book({ title, author, genre });
  newBook.save((err) => {
    if (err) {
      res.status(500).json({ error: 'Failed to save the book.' });
    } else {
      res.status(201).json(newBook);
    }
  });
});

// Get all books
app.get('/api/books', (req, res) => {
  Book.find({}, (err, books) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch books.' });
    } else {
      res.json(books);
    }
  });
});

// Get a specific book by ID
app.get('/api/books/:id', (req, res) => {
  const bookId = req.params.id;
  Book.findById(bookId, (err, book) => {
    if (err) {
      res.status(500).json({ error: 'Failed to find the book.' });
    } else if (!book) {
      res.status(404).json({ error: 'Book not found.' });
    } else {
      res.json(book);
    }
  });
});

// Update a specific book by ID
app.put('/api/books/:id', (req, res) => {
  const bookId = req.params.id;
  const { title, author, genre } = req.body;

  Book.findByIdAndUpdate(bookId, { title, author, genre }, { new: true }, (err, updatedBook) => {
    if (err) {
      res.status(500).json({ error: 'Failed to update the book.' });
    } else if (!updatedBook) {
      res.status(404).json({ error: 'Book not found.' });
    } else {
      res.json(updatedBook);
    }
  });
});

// Delete a specific book by ID
app.delete('/api/books/:id', (req, res) => {
  const bookId = req.params.id;
  Book.findByIdAndRemove(bookId, (err, deletedBook) => {
    if (err) {
      res.status(500).json({ error: 'Failed to delete the book.' });
    } else if (!deletedBook) {
      res.status(404).json({ error: 'Book not found.' });
    } else {
      res.json(deletedBook);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}...`);
});


