
import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, {
  timestamps: true,
});

export const Auth = mongoose.model<IUser>('Auth', userSchema);