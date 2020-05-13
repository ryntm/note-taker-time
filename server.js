const express = require('express');
const path = require('path');
const port = process.env.port || 3000;
const fs = require('fs');

const app = express();



let id = 1000;
const dbFile = './db'

// BOILER PLATE
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
//

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
})

app.post('/api/notes', (req, res) => {
    let notesArray = JSON.parse(fs.readFileSync(__dirname + "/db/db.json"));
    id++;
    let newNote = {id: id, title: req.body.title, text: req.body.text}
    notesArray.push(newNote);
    fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notesArray), (err) => {
        if (err) {
            throw err;
        }
    })
})

app.get('/api/notes', (req, res) => {
    fs.readFile(__dirname + '/db/db.json', (err, data) => {
        if (err) {
            console.log(err)
        }
        let notesArray = JSON.parse(data);
        return res.json(notesArray)
    })
})

app.delete('/api/notes/:id', (req, res) => {
    let notesArray = JSON.parse(fs.readFileSync(__dirname + '/db/db.json'))
    let deleteIndex = notesArray.findIndex(note => note.id == req.params.id);
    console.log(req.params.id)
    notesArray.splice(deleteIndex, 1)
    fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notesArray), (err) => {
        if (err) {
            throw err;
        }
    })
})



app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(port, () => console.log(`App is listening on port: ${port}`))