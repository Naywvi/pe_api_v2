const mongoose = require("mongoose");

const TransformedClientSchema = new mongoose.Schema({
  //<== main informations
  transformedclient_id: { type: Number, index: true, unique: true },
  transformedclient_help: { type: Boolean, required: true },
  transformedclient_token: { type: String, default: "" },
  //<== contact informations

  transformedclient_first_name: { type: String, required: true },
  transformedclient_last_name: { type: String, required: true },
  transformedclient_phone: { type: Number, required: true },
  transformedclient_mail: { type: String, required: true },
  transformedclient_city: { type: String, required: true },
  transformedclient_zip: { type: Number, required: true },

  //<== specifiq informations
  transformedclient_habitation: { type: String, required: true },
  transformedclient_type_residence: { type: String, required: true },
  transformedclient_type_heating: { type: String, default: "" },
  transformedclient_type_boiler: { type: String, default: "" },
  transformedclient_fiscal_years: { type: Number, required: true },
  transformedclient_property_tax: { type: Number, required: true },
  transformedclient_construction_date: { type: Date, default: "" },
  transformedclient_metter_habitable_surface: { type: Number, default: "" },
  transformedclient_isolation_type: { type: String, default: "" },
  transformedclient_isolation_surface: { type: Number, default: "" },
});

TransformedClientSchema.pre("save", async function (next) {
  const doc = this;
  doc.transformedclient_token =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  const totalCount = await mongoose
    .model("TransformedClient", TransformedClientSchema, "transformedclient")
    .countDocuments();
  doc.transformedclient_id = totalCount + 1;
  next();
});

const TransformedClientModel = mongoose.model("Transformedclient", TransformedClientSchema, "transformedclient");

module.exports = TransformedClientModel;