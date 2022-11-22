
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
var PORT = 3000;
app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"))
});
app.get("/notes", (req, res) => {
   res.sendFile(path.join(__dirname, "./public/notes.html"))
});

//get All notes
app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (error,notes) => {
      if (error) {
          return console.log(error)
      }
      res.json(JSON.parse(notes))
  })
});

//save notes
app.post("/api/notes", (req, res) => {
    const currentNote = req.body;
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (error, notes) => {
      if (error) {
          return console.log(error)
      }
      notes = JSON.parse(notes)
      if (notes.length > 0) {
      let lastId = notes[notes.length - 1].id
      var id =  parseInt(lastId)+ 1
      } else {
        var id = 10;
      }
      //create new note object
      let newNote = { 
        title: currentNote.title, 
        text: currentNote.text, 
        id: id 
        }
  
      //merge notes 
      var newNotesArr = notes.concat(newNote)
      //write new array to db.json file and retuern it to user
      fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(newNotesArr), (error, data) => {
        if (error) {
          return error
        }
        res.json(newNotesArr);
      })
  });
 
});

//delete chosen note 
app.delete("/api/notes/:id", (req, res) => {
  let deleteId = JSON.parse(req.params.id);

  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (error,notes) => {
    if (error) {
        return console.log(error)
    }
   let notesArray = JSON.parse(notes);

   for (var i=0; i<notesArray.length; i++){
     if(deleteId == notesArray[i].id) {
       notesArray.splice(i,1);

       fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(notesArray), (error, data) => {
        if (error) {
          return error
        }
        res.json(notesArray);
      })
     }
  }
  
}); 
});

//initialize app
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
