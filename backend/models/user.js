import { Schema, model } from 'mongoose';
import { genSalt, hash, compare } from 'bcryptjs';

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    default: 0
  },
}, { timestamps: true });


userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  
  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
});


userSchema.methods.comparePassword = async function (candidatePassword) {
  return await compare(candidatePassword, this.password);
};

const User = model('User', userSchema);

export default User;