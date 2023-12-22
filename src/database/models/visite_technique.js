const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    //<== Referrer informations
    vt_status_id: { type: Number, default: -1, required: true },
    vt_audit_id: { type: String, required: false, default: -1 },   
    vt_poseur_id: { type: String, required: false, default: -1},   
    vt_client_id: { type: String, required: true },  // ==> client transformed

    //<== contact/localisation informations
    vt_start_date: { type: Date, default: Date.now, required: true},
    vt_end_date: { type: Date, default: "", required: false},
    vt_meeting: { type: Date, required: false },
    vt_price: { type: Number, required: true },
    vt_zip: { type: String, required: true },
    
    //<== files informations 
    vt_folder: {
        folder1: { type: String, required: true },
        folder2: { type: String, required: false }
    },
    vt_file: {
        data: { type: Buffer, required: true },           // Les données du fichier (en tant que tableau de bytes)
        contentType: { type: String, required: true },    // Le type de contenu du fichier (ex: 'image/jpeg')
        filename: { type: String, required: true }         // Le nom original du fichier
    }
});

  visitSchema.pre('save', async function (next) {
      const doc = this;
      const totalCount = await mongoose.model('Visit', visitSchema, 'visit').countDocuments();
      doc.vt_status_id = totalCount + 1;
      next();
  });

const VisitModel = mongoose.model('Visit', visitSchema, 'visit');

module.exports = VisitModel;