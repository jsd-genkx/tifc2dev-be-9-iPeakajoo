const express = require("express");
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Simulated data for API
const books = [
  { id: 1,
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian"
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
  },
  {
    id: 3,
    title: "Testing book3",
    author: "Teeramaet",
    genre: "Fiction",
  },
];

// Filter books by genre (optional)
app.get("/books", (req, res, next) => {
  setTimeout(() => {
    const { genre } = req.query;
      if(genre) {
        const filteredBooks = books.filter((book) => book.genre.includes(genre));
        res.status(200)
        res.json(filteredBooks)
      } else {
        res.json(books)
      }
  }, 1000); // Simulate a 1-second delay
});

// GET specific book by ID with async/await
app.get("/books/:id", async (req, res, next) => {
  try {
    const book = await new Promise((resolve, reject) => {
    setTimeout(() => {
        const foundBook = books.find((b) => b.id === parseInt(req.params.id, 10));
      if (foundBook) {
        resolve(foundBook);
      } else {
        const err = new Error("Book not found")
        err.status = 404;
        reject(err);
      }
    }, 1000); // Simulate a 1-second delay
  });

    res.json(book);
    } catch(err) {
      console.log(err)
      next(err)
    }

});

app.use((err,req,res,next) => {
  const status = err.status || 500;
  const response = {
    message: err.message || "internal server error",
    status: status
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  console.error(err.stack)
  res.status(status).json(response)
})



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});