const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;

const MONGO_URI = process.env.MONGO_URI; 
const client = new MongoClient(MONGO_URI);

let db;

async function connectDB() {
    await client.connect();
    db = client.db('gooddump');
    console.log('Connected to MongoDB!');
}

app.use(cors());
app.use(express.json());

app.get('/entries', async (req, res) => {
    const entries = await db.collection('entries').find().sort({ _id: -1 }).toArray();
    res.json(entries);
});

app.post('/entries', async (req, res) => {
    const entry = req.body;
    await db.collection('entries').insertOne(entry);
    res.json({ message: 'entry saved!', entry });
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`The Good Dump backend running on port ${PORT}`);
    });
});