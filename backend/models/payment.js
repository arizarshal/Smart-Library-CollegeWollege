import { Schema, model } from 'mongoose';

const paymentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  borrowId: {
    type: Schema.Types.ObjectId,
    ref: 'Borrow',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'PAID'],
    default: 'PENDING'
  }
}, { timestamps: true });

const Payment = model('Payment', paymentSchema);

export default Payment;