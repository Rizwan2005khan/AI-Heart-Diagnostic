const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { spawn } = require('child_process');
const path = require('path');
const Record = require('./models/Record');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/heart-ai';
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- Routes ---

// @route   POST /api/predict
// @desc    Run prediction using Python model
app.post('/api/predict', async (req, res) => {
    const patientData = req.body;

    try {
        const pythonProcess = spawn('python', [
            path.join(__dirname, '..', 'ml', 'predict_json.py')
        ]);

        let outputData = '';

        // Write data to python stdin
        pythonProcess.stdin.write(JSON.stringify(patientData));
        pythonProcess.stdin.end();

        pythonProcess.stdout.on('data', (data) => {
            outputData += data.toString();
        });

        pythonProcess.on('close', async (code) => {
            if (code !== 0) {
                return res.status(500).json({ error: 'Prediction script failed' });
            }

            try {
                const result = JSON.parse(outputData);
                
                if (result.error) {
                    return res.status(400).json({ error: result.error });
                }

                // Save to History automatically
                const newRecord = new Record({
                    patientData,
                    prediction: {
                        label: result.label,
                        probability: result.probability,
                        confidence: result.confidence
                    }
                });
                await newRecord.save();

                res.json({ ...result, recordId: newRecord._id });
            } catch (err) {
                res.status(500).json({ error: 'Failed to parse prediction result' });
            }
        });

    } catch (err) {
        res.status(500).json({ error: 'Server error during prediction' });
    }
});

// @route   GET /api/history
// @desc    Get diagnostic history
app.get('/api/history', async (req, res) => {
    try {
        const history = await Record.find().sort({ createdAt: -1 }).limit(20);
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
