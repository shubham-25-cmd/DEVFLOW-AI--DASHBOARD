import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    githubId: {
      type: Number,
      required: true,
      unique: true,
    },
    avatarUrl: {
      type: String,
    },
    accessToken: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);