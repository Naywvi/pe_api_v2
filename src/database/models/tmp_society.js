const mongoose = require("mongoose");

const societySchema = new mongoose.Schema({
  //<== main informations
  temp_society_created_date: { type: Date, default: Date.now() },
  temp_society_id: { type: Number, index: true, unique: true, default: 0 },
  temp_society_owner: { type: String, required: true },
  temp_society_audited: { type: Boolean, default: false, required: true },
  temp_society_comment: { type: String, default: "" },
  temp_society_rank: { type: Number, default: 0, required: true },

  // contact informations
  temp_society_name: { type: String, unique: true, required: true },
  temp_society_phone: { type: Number, unique: true, required: true },
  temp_society_fix: { type: Number, unique: true, required: true },
  temp_society_fax: { type: Number, unique: true },
  temp_society_mail: { type: String, unique: true, required: true },
  temp_society_zip: { type: Number, required: true },
  temp_society_city: { type: String, unique: true, required: true },
  temp_society_address: { type: String, required: true },

  //<== about society informations
  temp_society_beneficiary: { type: String, required: true },
  temp_society_web: { type: String },
  temp_society_siret: { type: String, unique: true, required: true },
  temp_society_sirene: { type: String, unique: true, required: true },
  temp_society_tva: { type: String, required: true, unique: true },
  temp_society_legal_status: { type: String, required: true },
  temp_society_naf: { type: String, unique: true, required: true },
  temp_society_certification: { type: [String], default: [] },
});

// Middleware to handle auto-increment for temp_society_id
societySchema.pre("save", async function (next) {
  const doc = this;
  const totalCount = await mongoose
    .model("Tmp_society", societySchema, "tmp_society")
    .countDocuments();
  doc.temp_society_id = totalCount + 1;
  next();
});

const SocietyModel = mongoose.model(
  "Tmp_society",
  societySchema,
  "tmp_society"
);

module.exports = SocietyModel;
