import { Schema, model } from 'mongoose';

const borrowSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "User is required for borrowing"],
    index: true
  },
  bookId: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, "Book is required for borrowing"],
    index: true
  },
  borrowDate: {
    type: Date,
    default: Date.now,
    required: [true, "Borrow date is required"],
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: [true, "Due date is required"],
    validate: {
        validator: function (value) {
          return value > this.borrowDate;
        },
        message: "Due date must be after borrow date",
      },
  },
  returnDate: {
    type: Date,
    default: null,
      validate: {
        validator: function (value) {
          if (!value) return true;
          return value >= this.borrowDate;
        },
        message: "Return date cannot be before borrow date",
      },
  },
  totalCost: {
    type: Number,
    default: 0,
    min: [0, "Total cost cannot be negative"],
  },
  totalOverdue: {
    type: Number,
    default: 0,
    min: [0, "Total overdue cannot be negative"],
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'RETURNED'],
    default: 'ACTIVE'
  }
}, { timestamps: true });

borrowSchema.index({ userId: 1, status: 1 });

const Borrow = model('Borrow', borrowSchema);

export default Borrow;
