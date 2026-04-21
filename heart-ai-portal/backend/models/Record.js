const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
    patientData: {
        age: Number,
        sex: Number,
        cp: Number,
        trestbps: Number,
        chol: Number,
        fbs: Number,
        restecg: Number,
        thalach: Number,
        exang: Number,
        oldpeak: Number,
        slope: Number,
        ca: Number,
        thal: Number
    },
    prediction: {
        label: String,
        probability: Number,
        confidence: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Record', RecordSchema);
