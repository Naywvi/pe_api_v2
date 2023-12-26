const mongoose = require("mongoose");

const societySchema = new mongoose.Schema({
  //<== main informations
  society_id: { type: Number, index: true, unique: true, default: 0 },
  society_rank_id: { type: Number, required: true },
  society_banned: { type: Boolean, required: true, default: false },

  //<== informations client
  society_name: { type: String, unique: true, required: true },
  society_owner: { type: String, required: true },
  society_tel: { type: Number, unique: true, required: true },
  society_fix: { type: Number, unique: true, required: false },
  society_fax: { type: Number, unique: true, required: false },
  society_address: { type: String, required: true },
  society_zip: { type: Number, required: true },
  society_city: { type: String, required: true },
  society_mail: { type: String, unique: true, required: true },
  society_siret: { type: String, unique: true, required: true },
  society_sirene: { type: String, unique: true, required: true },
  society_naf: { type: String, unique: true, required: true },
  society_tva: { type: String, unique: true, required: true },
});

// Middleware to handle auto-increment for society_id
societySchema.pre("save", async function (next) {
  const doc = this;

  const totalCount = await mongoose
    .model("Society", societySchema, "society")
    .countDocuments();
  doc.society_id = totalCount + 1;
  next();
});

const SocietyModel = mongoose.model("Society", societySchema, "society");

module.exports = SocietyModel;
