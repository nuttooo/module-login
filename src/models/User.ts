import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema = new Schema({
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
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
    default: null,
  },
  role: {
    type: String,
    enum: ['User', 'Admin'],
    default: 'User',
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive','Unverified'],
    default: 'Unverified',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { strict: true });

userSchema.pre('save', function (next) {
  console.log('Middleware - User data before saving:', this);
  this.updatedAt = new Date();
  next();
});

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
