import { Schema, model } from 'mongoose';

const borrowSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookId: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  borrowDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date
  },
  totalCost: {
    type: Number,
    default: 0
  },
  totalOverdue: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'RETURNED'],
    default: 'ACTIVE'
  }
}, { timestamps: true });

const Borrow = model('Borrow', borrowSchema);

export default Borrow;
