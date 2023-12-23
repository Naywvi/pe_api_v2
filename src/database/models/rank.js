/*
for society / society fournisseur / society main 
*/

/*
99 = Super Admin
1 = Society owner
2 = >confirmateur
3 = >>auditeur
4 = >>poseur
5 = >>>client

6 = >Sous traitant society
3 = >>auditeur
4 = >>poseur
..
*/

const mongoose = require("mongoose");

const csocietySchema = new mongoose.Schema({
  //<== main informations
  rank_id: { type: Number, required: true },
  rank_name: { type: String, required: true },
  rank_desc: { type: String, required: true },
  rank_level: { type: Number, required: true },
  rank_active: { type: Boolean, required: true },
});
const SocietyModel = mongoose.model("Rank", csocietySchema, "rank");

module.exports = SocietyModel;

// Middleware to handle auto-increment for society_id
// csocietySchema.pre("save", async function (next) {
//   const totalCount = await mongoose
//     .model("Society", csocietySchema, "society")
//     .countDocuments();
//   doc.society_id = totalCount + 1;
//   next();
// });
