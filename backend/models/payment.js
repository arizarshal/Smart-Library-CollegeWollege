import { Schema, model } from 'mongoose';

const paymentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "User is required for payment"],
    index: true
  },
  borrowId: {
    type: Schema.Types.ObjectId,
    ref: 'Borrow',
    required: [true, "Borrow is required for payment"],
    index: true
  },
  amount: {
    type: Number,
    required: [true, "Amount is required for payment"],
    min: [0, "Amount cannot be negative"]
  },
  status: {
    type: String,
    enum: {
      values: ['PENDING', 'PAID'],
      message: '{VALUE} is not a valid payment status'
    },
    default: 'PENDING'
  }
}, { timestamps: true });

const Payment = model('Payment', paymentSchema);

export default Payment;