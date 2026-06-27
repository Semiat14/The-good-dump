const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let entries = [];

app.get('/entries', (req, res) => {
    res.json(entries);
});

app.post('/entries', (req, res) => {
    const entry = req.body;
    entries.unshift(entry);
    res.json({ message: 'entry saved!', entry });
});

app.listen(PORT, () => {
    console.log(`The Good Dump backend running on port ${PORT}`);
});