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


// app.get('/api/notes', async (req, res) => {
//     try {
//         const notes = await readFileAsync('./db/db.json', 'utf8');
//         res.send(notes);
//       } catch (err) {
//         console.error(err);
//         res.status(500).send('Internal Server Error');
//       }
//     });
    
//     app.listen(3000, () => {
//       console.log('Server listening on port 3000');
//     });

