const express = require('express');
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static('public'));

let notes = [];

fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if(err) {
        console.error(err);
        return
    }
    notes = JSON.parse(data);
});

app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    const newNote = {
        id: notes.length + 1,
        title: req.body.title,
        text: req.body.text,
    };
    notes.push(newNote);
    fs.writeFile('./db/db.json', JSON.stringify(notes), 'utf8', err => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to save note' });
        } else {
            res.json(newNote);
        }
    });
});


