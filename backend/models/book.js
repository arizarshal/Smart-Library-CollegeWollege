import { Schema, model } from 'mongoose';

const bookSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    minLength: [2, "Title must be at least 2 characters"],
    maxLength: [200, "Title cannot exceed 200 characters"]
  },
  author: {
    type: String,
    required: [true, "Author is required"],
    trim: true,
    minLength: [2, "Author must be at least 2 characters"],
    maxLength: [100, "Author cannot exceed 100 characters"]
  },
  singlePricePerDay: {
    type: Number,
    required: [true, "Single price per day is required"],
    min: [0, "Single price per day must be positive"]
  },
  groupPricePerDay: {
    type: Number,
    required: [true, "Group price per day is required"],
    min: [0, "Group price per day must be positive"],
    validate: {
        validator: function (value) {
          return value <= this.singlePricePerDay;
        },
        message: "Group price must be less than or equal to single price",
      },
  },
  image: {
    type: String,
    required: [true, "Book Image URL is required"],
  },
  duePerDay: {
    type: Number,
    required: [true, "Due per day is required"],
    min: [0, "Due per day must be positive"]
  },
  isBorrowed: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });

// For available books, newest first
bookSchema.index({ isBorrowed: 1, createdAt: -1 });

// Good for sorting title/author while filtering availability
bookSchema.index({ isBorrowed: 1, title: 1 });
bookSchema.index({ isBorrowed: 1, author: 1 });

// Text search index for title and author
bookSchema.index({ title: "text", author: "text" });

// Price sort within availability filter
bookSchema.index({ isBorrowed: 1, singlePricePerDay: 1 });


const Book = model('Book', bookSchema);

export default Book;
