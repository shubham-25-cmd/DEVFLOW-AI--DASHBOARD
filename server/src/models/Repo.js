import mongoose from 'mongoose';

const repoSchema = new mongoose.Schema({
  githubId:   { type: Number, required: true },
  name:       { type: String, required: true },
  fullName:   { type: String, required: true },
  owner:      { type: String, required: true },
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  url:        { type: String },
  hasWorkflows: { type: Boolean, default: false }
}, { timestamps: true });

repoSchema.index({ userId: 1, githubId: 1 }, { unique: true });

const Repo = mongoose.model('Repo', repoSchema);
export default Repo;
