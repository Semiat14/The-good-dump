const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'gooddump-secret';

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
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const existing = await db.collection('users').findOne({ email });
    if (existing) return res.status(400).json({ message: 'user already exists' });
    const hashed = await bcrypt.hash(password, 10);
    await db.collection('users').insertOne({ email, password: hashed });
    res.json({ message: 'account created!' });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await db.collection('users').findOne({ email });
    if (!user) return res.status(400).json({ message: 'user not found' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'wrong password' });
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.json({ token });
});
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