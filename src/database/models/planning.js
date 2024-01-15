const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  contacts: [], // Référence aux utilisateurs pour les contacts
});

const scheduleSchema = new mongoose.Schema({
  planning_user: { type: String, unique: true }, // Référence à l'utilisateur
  planning_daysOff: [{ type: Date }], // Liste des jours de congé
  planning_events: [eventSchema],
});

const ScheduleModel = mongoose.model("Planning", scheduleSchema);

module.exports = ScheduleModel;
