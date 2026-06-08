import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  githubId:    { type: Number, required: true, unique: true },
  username:    { type: String, required: true },
  email:       { type: String },
  avatarUrl:   { type: String },
  accessToken: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
