const express = require('express');
const path = require("path");
const fs = require("fs");

//PORT to run the server on
const app = express();
const PORT = process.env.PORT || 3001;

//middleware
app.use(express.json());
app.use(express.static('public'));

let notes = [];

//read from file db.json
fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if(err) {
        console.error(err);
        return
    }
    notes = JSON.parse(data);
});

//get route for api/notes
app.get('/api/notes', (req, res) => {
    res.json(notes);
});

//post route for api/notes to add new note
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

//get route for any path that matches with public/notes.html
app.get('*',(req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

//delete route for api/notes/:id using the id as a parameter to delete the note
app.delete('/api/notes/:id', (req, res) => {
    const noteId = parseInt(req.params.id);
    const index = notes.findIndex(note => note.id === noteId);
    if(index !== -1) {
        notes.splice(index, 1);
        fs.writeFile('./db/db.json', JSON.stringify(notes), 'utf8', err => {
            if(err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to delete note' });
            } else {
                res.sendStatus(204);
            }
        });
    } else {
        res.status(404).json({ error: 'Note not found' });
    }
});

//PORT listener 
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});