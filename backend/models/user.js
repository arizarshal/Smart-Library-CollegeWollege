import validator from 'validator';
import { Schema, model } from 'mongoose';
import { genSalt, hash, compare } from 'bcryptjs';

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [5, "Email must be at least 5 characters"],
    maxlength: [100, "Email cannot exceed 100 characters"],
    validate: {
      validator: (value) => validator.isEmail(value),
      message: "Please enter a valid email address",
  },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  balance: {
    type: Number,
    default: 0,
    min: [0, "Balance cannot be negative"],
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN", "LIBRARIAN"],
    default: "USER",
  }
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