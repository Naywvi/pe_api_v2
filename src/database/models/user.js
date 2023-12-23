const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  //<== main informations
  user_inscription_date: { type: Date, default: Date.now },
  user_id: { type: Number, index: true, unique: true },
  user_token: { type: String, default: "" },

  //<== references informations
  user_soc_id: { type: Number, required: true, default: -1 },
  user_planning_id: { type: Number, default: -1 },
  user_rank_id: { type: Number, default: -1 },

  //<== contact informations
  user_first_name: { type: String, required: true }, //*
  user_last_name: { type: String, required: true }, //*
  user_mail: { type: String, required: true }, //*
  user_phone: { type: Number, required: true }, //*
  user_birthday: { type: Date },
  user_address: { type: String, required: true }, //*
  user_zip: { type: Number, required: true }, //*
  user_pwd: { type: String, required: true }, //*

  //<== other informations
  user_new: { type: Boolean, required: true, default: true },
  user_banned: { type: Boolean, default: false },
  user_admin: { type: Boolean, default: false, required: true },
});

//<== indexes creation for unique fields
userSchema.index(
  { user_admin: 1 },
  { unique: true, partialFilterExpression: { user_admin: true } }
);

//<== pre save hook to generate token and id
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
