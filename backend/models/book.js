import { Schema, model } from 'mongoose';

const bookSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  singlePricePerDay: {
    type: Number,
    required: true
  },
  groupPricePerDay: { 
    type: Number, 
    required: true 
  },
  image: {
      type: String,
      required: true
    },
  duePerDay: {
    type: Number,
    required: true
  },
  isBorrowed: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });

const Book = model('Book', bookSchema);

export default Book;
