const mongoose = require("mongoose");

const planningConfigSchema = new mongoose.Schema({
  cplanning_society: {
    type: Number,
    ref: "User",
    unique: true,
  }, // Référence à l'utilisateur
  cplanning_startDate: { type: Date, required: true }, // Date de début de planning
  cplanning_daysOff: [{ type: Date }], // Liste des jours de congé
  cplanning_event,
});

const PlanningConfigModel = mongoose.model(
  "PlanningConfig",
  planningConfigSchema
);

module.exports = PlanningConfigModel;
