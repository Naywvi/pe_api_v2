const mongoose = require("mongoose");

const TClientSchema = new mongoose.Schema({

});

TClientSchema.pre("save", async function (next) {
  const doc = this;
  doc.tclient_token =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  const totalCount = await mongoose
    .model("TClient", TClientSchema, "tclient")
    .countDocuments();
  doc.tclient_id = totalCount + 1;
  next();
});

const TClientModel = mongoose.model("TClient", TClientSchema, "tclient");

module.exports = TClientModel;