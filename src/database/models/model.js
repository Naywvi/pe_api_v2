const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user_id: { type: Number, index: true, unique: true },
  user_token: { type: String, default: "" },
  user_rank_id: { type: Number, default: 0 },
  user_first_name: { type: String, required: true },
  user_last_name: { type: String, required: true },
  user_banned: { type: Boolean, default: false },
  user_pwd: { type: String, required: true },
  user_zip: { type: String, required: true },
  user_soc_id: { type: Number, required: true, default: -1 },
  user_new: { type: Boolean, default: true },
  user_admin: { type: Boolean, default: false, required: true },
});

userSchema.index(
  { user_admin: 1 },
  { unique: true, partialFilterExpression: { user_admin: true } }
);

userSchema.pre("save", async function (next) {
  const doc = this;
  if (doc.user_admin) {
    const admin = await mongoose
      .model("User", userSchema, "user")
      .findOne({ user_admin: true });
    if (admin) return false;
  }

  doc.user_token =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  const totalCount = await mongoose
    .model("User", userSchema, "user")
    .countDocuments();
  doc.user_id = totalCount + 1;
  next();
});

const UserModel = mongoose.model("User", userSchema, "user");

module.exports = UserModel;
