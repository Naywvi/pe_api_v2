const mongoose = require("mongoose");

const societySchema = new mongoose.Schema({
  //<== main informations
  society_id: { type: Number, index: true, unique: true, default: 0 },
  society_admin: { type: Boolean, unique: true, required: true },
  society_rank_id: { type: Number, required: true },
  
  //<== informations client
  society_name: { type: String, unique: true, required: true },
  society_owner: { type: String, required: true },
  society_tel: { type: String, unique: true, required: true },
  society_fix: { type: String, unique: true, required: true },
  society_fax: { type: String, unique: true, required: true },
  society_address: { type: String, required: true },
  society_zip: { type: String, required: true },
  society_city: { type: String, unique: true, required: true },
  society_mail: { type: String, unique: true, required: true },
  society_siret: { type: String, unique: true, required: true },
  society_sirene: { type: String, unique: true, required: true },
  society_naf: { type: String, unique: true, required: true },
});

// Indexes for unique fields
societySchema.index(
  { society_admin: 1 },
  { unique: true, partialFilterExpression: { society_admin: true } }
);

// Middleware to handle auto-increment for society_id
societySchema.pre("save", async function (next) {
  const doc = this;
  if (doc.society_admin) {
    //<== if society_admin is true then check if there is already an admin
    const admin = await mongoose
      .model("Society", userSchema, "society")
      .findOne({ society_admin: true });
    if (admin) return false;
  }

  const totalCount = await mongoose
    .model("Society", societySchema, "society")
    .countDocuments();
  doc.society_id = totalCount + 1;
  next();
});

const SocietyModel = mongoose.model("Society", societySchema, "society");

module.exports = SocietyModel;
